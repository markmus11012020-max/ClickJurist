export interface ConfigStatus {
  openrouter: boolean;
  yookassa: boolean;
  ready: boolean;
  missing: string[];
}

export function getConfigStatus(): ConfigStatus {
  const missing: string[] = [];

  const openrouter = Boolean(process.env.OPENROUTER_API_KEY?.trim() &&
    process.env.OPENROUTER_API_KEY !== 'your_openrouter_api_key');

  if (!openrouter) {
    missing.push('OPENROUTER_API_KEY');
  }

  const yookassa = Boolean(
    process.env.YOOKASSA_SHOP_ID?.trim() && process.env.YOOKASSA_SECRET_KEY?.trim(),
  );

  if (!yookassa) {
    missing.push('YOOKASSA_SHOP_ID / YOOKASSA_SECRET_KEY (опционально для PDF-оплаты)');
  }

  return {
    openrouter,
    yookassa,
    ready: openrouter,
    missing,
  };
}
