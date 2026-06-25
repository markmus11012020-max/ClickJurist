import { ConsultationRequest, ConsultationResponse } from '@clickjurist/shared';
import { API_URL } from '@/constants/config';

export async function requestConsultation(
  payload: ConsultationRequest,
): Promise<ConsultationResponse> {
  const response = await fetch(`${API_URL}/api/v1/consultation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { error?: string }).error || 'Ошибка сервера');
  }

  return response.json() as Promise<ConsultationResponse>;
}

export async function createPayment(
  sessionId: string,
  amount?: number,
): Promise<{ confirmationUrl: string; paymentId: string }> {
  const response = await fetch(`${API_URL}/api/v1/payments/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, amount }),
  });

  if (!response.ok) {
    throw new Error('Не удалось создать платёж');
  }

  return response.json();
}

export async function checkPaymentStatus(sessionId: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/api/v1/payments/status/${sessionId}`);
  if (!response.ok) return false;
  const data = (await response.json()) as { isPaid: boolean };
  return data.isPaid;
}

export async function fetchPaymentConfig(): Promise<{ enabled: boolean; price: number }> {
  const response = await fetch(`${API_URL}/api/v1/payments/config`);
  if (!response.ok) return { enabled: false, price: 199 };
  return response.json() as Promise<{ enabled: boolean; price: number }>;
}
