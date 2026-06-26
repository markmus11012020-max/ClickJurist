import { AgeGroup, ConsultationGoal, LegalCategory, UserRole } from './enums';

/** Входные данные Wizard-формы */
export interface WizardFormData {
  ageGroup: AgeGroup;
  role: UserRole;
  topic: string;
  description: string;
  goals: ConsultationGoal[];
}

/** Запрос на консультацию к бэкенду */
export interface ConsultationRequest {
  form: WizardFormData;
  clarification?: string;
  sessionId: string;
}

/** Блок уточнения (раздел 6 ТЗ) */
export interface ClarificationRequest {
  needs_more_data: boolean;
  question: string | null;
}

import { DocumentType } from './enums';

/** Данные для генерации PDF */
export interface DocumentData {
  document_type: DocumentType | '';
  extracted_fields: {
    amount: number | null;
    date: string | null;
  };
}

/** Юридический анализ в ответе */
export interface LegalAnalysis {
  category: LegalCategory | string;
  age_legal_status: string;
  user_friendly_consultation: string;
}

/** Финальный JSON-ответ бэкенда (раздел 5 ТЗ) */
export interface ConsultationResponse {
  legal_analysis: LegalAnalysis;
  step_by_step_plan: string[];
  document_data: DocumentData;
  clarification_request: ClarificationRequest;
}

/** Статус сессии оплаты */
export interface PaymentSession {
  sessionId: string;
  isPaid: boolean;
  amount: number;
  paymentId?: string;
  confirmationUrl?: string;
}

/** Брендовые цвета из Logotip2.html */
export const BRAND_COLORS = {
  bgDark: '#0F172A',
  primaryBlue: '#0052FF',
  accentCyan: '#00F0FF',
  textWhite: '#FFFFFF',
  textMuted: '#94A3B8',
} as const;

/** Стоимость PDF (раздел 8 ТЗ) */
export const PDF_PRICE_RANGE = { min: 100, max: 300, default: 199 } as const;
