import {
  AGE_GROUP_LABELS,
  ConsultationResponse,
  DocumentType,
  USER_ROLE_LABELS,
  WizardFormData,
} from '../shared';
import { config } from '../config';
import {
  buildUserPrompt,
  EDITOR_SYSTEM_PROMPT,
  GENERATOR_SYSTEM_PROMPT,
} from '../prompts';
import { callOpenRouter, parseJsonSafe } from './openrouter';

interface GeneratorOutput {
  generator_raw: string;
  category: string;
  needs_clarification: boolean;
  clarification_question: string | null;
}

interface EditorOutput {
  corrected_consultation: string;
  step_by_step_plan: string[];
  document_type: DocumentType | '';
  extracted_amount: number | null;
  extracted_date: string | null;
}

function mapAgeStatus(ageGroup: string): string {
  const label = AGE_GROUP_LABELS[ageGroup as keyof typeof AGE_GROUP_LABELS];
  return label || ageGroup;
}

function buildFallbackResponse(
  generatorRaw: string,
  category: string,
  ageGroup: string,
): ConsultationResponse {
  return {
    legal_analysis: {
      category,
      age_legal_status: mapAgeStatus(ageGroup),
      user_friendly_consultation: generatorRaw,
    },
    step_by_step_plan: [],
    document_data: {
      document_type: '', // Fallback to an empty string since we don't have a specific type
      extracted_fields: { amount: null, date: null },
    },
    clarification_request: {
      needs_more_data: false,
      question: null,
    },
  };
}

export async function runAiCascade(
  form: WizardFormData,
  clarification?: string,
): Promise<ConsultationResponse> {
  const userPrompt = buildUserPrompt({
    ageGroup: AGE_GROUP_LABELS[form.ageGroup],
    role: USER_ROLE_LABELS[form.role],
    topic: form.topic,
    description: form.description,
    goals: form.goals,
    clarification,
  });

  // Шаг 1: Генератор
  const generatorRaw = await callOpenRouter(config.openrouter.generatorModel, [
    { role: 'system', content: GENERATOR_SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);

  const generator = parseJsonSafe<GeneratorOutput>(generatorRaw);

  if (!generator?.generator_raw) {
    throw new Error('Generator returned invalid response');
  }

  // Если нужно уточнение — возвращаем без редактора
  if (generator.needs_clarification && generator.clarification_question && !clarification) {
    return {
      legal_analysis: {
        category: generator.category,
        age_legal_status: mapAgeStatus(form.ageGroup),
        user_friendly_consultation: generator.generator_raw,
      },
      step_by_step_plan: [],
      document_data: {
        document_type: '', // Fallback to an empty string
        extracted_fields: { amount: null, date: null },
      },
      clarification_request: {
        needs_more_data: true,
        question: generator.clarification_question,
      },
    };
  }

  // Шаг 2: Невидимый Редактор (с отказоустойчивостью — раздел 9 ТЗ)
  let editor: EditorOutput | null = null;

  try {
    const editorRaw = await callOpenRouter(
      config.openrouter.editorModel,
      [
        { role: 'system', content: EDITOR_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Черновик для проверки:\n${generator.generator_raw}\n\nКатегория: ${generator.category}`,
        },
      ],
      45000,
    );
    editor = parseJsonSafe<EditorOutput>(editorRaw);
  } catch {
    // При таймауте/ошибке редактора — отдаём сырой ответ генератора
    return buildFallbackResponse(generator.generator_raw, generator.category, form.ageGroup);
  }

  if (!editor?.corrected_consultation) {
    return buildFallbackResponse(generator.generator_raw, generator.category, form.ageGroup);
  }

  return {
    legal_analysis: {
      category: generator.category,
      age_legal_status: mapAgeStatus(form.ageGroup),
      user_friendly_consultation: editor.corrected_consultation,
    },
    step_by_step_plan: editor.step_by_step_plan || [],
    document_data: {
      document_type: editor.document_type,
      extracted_fields: {
        amount: editor.extracted_amount,
        date: editor.extracted_date,
      },
    },
    clarification_request: {
      needs_more_data: false,
      question: null,
    },
  };
}
