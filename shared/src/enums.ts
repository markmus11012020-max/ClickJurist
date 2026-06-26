/** Юридические категории — классификатор ИИ (раздел 3 ТЗ) */
export enum LegalCategory {
  COURT_ORDER = 'court_order',
  LABOR_DISPUTE = 'labor_dispute',
  CONSUMER_RIGHTS = 'consumer_rights',
  JKH_DISPUTE = 'jkh_dispute',
  ADMINISTRATIVE = 'administrative',
  CRIMINAL_VICTIM = 'criminal_victim',
  CRIMINAL_EMERGENCY = 'criminal_emergency',
}

export const LEGAL_CATEGORY_LABELS: Record<LegalCategory, string> = {
  [LegalCategory.COURT_ORDER]: 'Судебные приказы (ЖКХ, МФО, банки)',
  [LegalCategory.LABOR_DISPUTE]: 'Трудовое право',
  [LegalCategory.CONSUMER_RIGHTS]: 'Права потребителей',
  [LegalCategory.JKH_DISPUTE]: 'Жилищные споры',
  [LegalCategory.ADMINISTRATIVE]: 'КоАП РФ',
  [LegalCategory.CRIMINAL_VICTIM]: 'УК РФ — пострадавший',
  [LegalCategory.CRIMINAL_EMERGENCY]: 'Экстренное задержание (ст. 51)',
};

/** Возрастная градация ответственности (шаг 1 Wizard) */
export enum AgeGroup {
  UNDER_14 = 'under_14',
  AGE_14_16 = '14_16',
  AGE_16_18 = '16_18',
  OVER_18 = 'over_18',
}

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  [AgeGroup.UNDER_14]: 'До 14 лет',
  [AgeGroup.AGE_14_16]: '14–16 лет',
  [AgeGroup.AGE_16_18]: '16–18 лет',
  [AgeGroup.OVER_18]: 'Старше 18 лет',
};

/** Роль пользователя (шаг 2 Wizard) */
export enum UserRole {
  VICTIM = 'victim',
  OFFENDER = 'offender',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.VICTIM]: 'Я Потерпевший / Жертва',
  [UserRole.OFFENDER]: 'Я Виновник',
};

/** Цели обращения (шаг 5 Wizard) */
export enum ConsultationGoal {
  CONSULTATION = 'consultation',
  DOCUMENT = 'document',
  ACTION_PLAN = 'action_plan',
}

export const CONSULTATION_GOAL_LABELS: Record<ConsultationGoal, string> = {
  [ConsultationGoal.CONSULTATION]: 'Консультация',
  [ConsultationGoal.DOCUMENT]: 'Бланк документа',
  [ConsultationGoal.ACTION_PLAN]: 'План действий',
};

/** Типы документов для генерации (раздел 7 ТЗ) */
export enum DocumentType {
  COURT_ORDER_OBJECTION = 'court_order_objection',
  TERMINATION_OF_LEASE_NOTICE = 'termination_of_lease_notice',
  COMPLAINT_TO_HOUSING_INSPECTORATE = 'complaint_to_housing_inspectorate',
  STATEMENT_OF_CLAIM = 'statement_of_claim',
  APPLICATION_FOR_DISMISSAL = 'application_for_dismissal',
  COMPLAINT_TO_RSPOTREBNADZOR = 'complaint_to_rspotrebnadzor',
  GENERIC_APPLICATION = 'generic_application',
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.COURT_ORDER_OBJECTION]: 'Возражение на судебный приказ',
  [DocumentType.TERMINATION_OF_LEASE_NOTICE]: 'Уведомление о расторжении договора аренды',
  [DocumentType.COMPLAINT_TO_HOUSING_INSPECTORATE]: 'Жалоба в жилищную инспекцию',
  [DocumentType.STATEMENT_OF_CLAIM]: 'Исковое заявление',
  [DocumentType.APPLICATION_FOR_DISMISSAL]: 'Заявление на увольнение',
  [DocumentType.COMPLAINT_TO_RSPOTREBNADZOR]: 'Жалоба в Роспотребнадзор',
  [DocumentType.GENERIC_APPLICATION]: 'Заявление',
};
