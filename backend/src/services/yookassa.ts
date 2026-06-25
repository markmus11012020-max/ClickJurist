import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

/** In-memory хранилище сессий оплаты (без персональных данных) */
const paymentSessions = new Map<string, { isPaid: boolean; paymentId?: string }>();

export function isYooKassaConfigured(): boolean {
  return Boolean(config.yookassa.shopId && config.yookassa.secretKey);
}

export function getPaymentStatus(sessionId: string): boolean {
  return paymentSessions.get(sessionId)?.isPaid ?? false;
}

export function markAsPaid(sessionId: string, paymentId: string): void {
  paymentSessions.set(sessionId, { isPaid: true, paymentId });
}

function authHeader(): string {
  return `Basic ${Buffer.from(`${config.yookassa.shopId}:${config.yookassa.secretKey}`).toString('base64')}`;
}

interface YooKassaPaymentResponse {
  id: string;
  status: string;
  confirmation?: { confirmation_url?: string };
}

function buildReceipt(amount: number) {
  return {
    items: [
      {
        description: 'CLICK JURIST — анонимный бланк документа',
        quantity: '1.00',
        amount: { value: amount.toFixed(2), currency: 'RUB' },
        vat_code: 1,
        payment_mode: 'full_payment',
        payment_subject: 'service',
      },
    ],
  };
}

export async function createPayment(
  sessionId: string,
  amount: number,
): Promise<{ paymentId: string; confirmationUrl: string }> {
  if (!isYooKassaConfigured()) {
    throw new Error('ЮKassa не настроена. Заполните YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в .env');
  }

  const idempotenceKey = uuidv4();

  const response = await fetch('https://api.yookassa.ru/v3/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
      'Idempotence-Key': idempotenceKey,
    },
    body: JSON.stringify({
      amount: { value: amount.toFixed(2), currency: 'RUB' },
      confirmation: {
        type: 'redirect',
        return_url: `${config.yookassa.redirectUrl}?session=${sessionId}`,
      },
      capture: true,
      description: 'CLICK JURIST — анонимный бланк документа',
      metadata: { session_id: sessionId },
      receipt: buildReceipt(amount),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`YooKassa error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as YooKassaPaymentResponse;
  const confirmationUrl = data.confirmation?.confirmation_url;

  if (!confirmationUrl) {
    throw new Error('No confirmation URL from YooKassa');
  }

  paymentSessions.set(sessionId, { isPaid: false, paymentId: data.id });

  return { paymentId: data.id, confirmationUrl };
}

/** Синхронизация статуса с API ЮKassa (если webhook ещё не пришёл) */
export async function syncPaymentStatus(sessionId: string): Promise<boolean> {
  const cached = paymentSessions.get(sessionId);
  if (cached?.isPaid) return true;

  const paymentId = cached?.paymentId;
  if (!paymentId || !isYooKassaConfigured()) {
    return getPaymentStatus(sessionId);
  }

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  });

  if (!response.ok) {
    return getPaymentStatus(sessionId);
  }

  const data = (await response.json()) as YooKassaPaymentResponse;
  if (data.status === 'succeeded') {
    markAsPaid(sessionId, paymentId);
    return true;
  }

  return false;
}

export function handleWebhookEvent(event: {
  event: string;
  object: { id: string; metadata?: { session_id?: string } };
}): void {
  if (event.event === 'payment.succeeded') {
    const sessionId = event.object.metadata?.session_id;
    if (sessionId) {
      markAsPaid(sessionId, event.object.id);
    }
  }
}
