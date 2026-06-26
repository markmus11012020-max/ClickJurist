import { AgeGroup, ConsultationGoal, DocumentType, LegalCategory, UserRole } from './enums';

export interface WizardFormData {
  ageGroup: AgeGroup;
  role: UserRole;
  topic: string;
  description: string;
  goals: ConsultationGoal[];
}

export interface ConsultationRequest {
  form: WizardFormData;
  clarification?: string;
  sessionId: string;
}

export interface ClarificationRequest {
  needs_more_data: boolean;
  question: string | null;
}

export interface DocumentData {
  document_type: DocumentType | '';
  extracted_fields: {
    amount: number | null;
    date: string | null;
  };
}

export interface LegalAnalysis {
  category: LegalCategory | string;
  age_legal_status: string;
  user_friendly_consultation: string;
}

export interface ConsultationResponse {
  legal_analysis: LegalAnalysis;
  step_by_step_plan: string[];
  document_data: DocumentData;
  clarification_request: ClarificationRequest;
}

export interface PaymentSession {
  sessionId: string;
  isPaid: boolean;
  amount: number;
  paymentId?: string;
  confirmationUrl?: string;
}

export const BRAND_COLORS = {
  bgDark: '#0F172A',
  primaryBlue: '#0052FF',
  accentCyan: '#00F0FF',
  textWhite: '#FFFFFF',
  textMuted: '#94A3B8',
} as const;

export const PDF_PRICE_RANGE = { min: 100, max: 300, default: 199 } as const;
