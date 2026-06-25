import { Router, Request, Response } from 'express';
import { config } from '../config';
import {
  createPayment,
  getPaymentStatus,
  handleWebhookEvent,
  isYooKassaConfigured,
  syncPaymentStatus,
} from '../services/yookassa';

const router = Router();

router.get('/config', (_req: Request, res: Response) => {
  res.json({
    enabled: isYooKassaConfigured(),
    price: config.pdfPrice,
    currency: 'RUB',
  });
});

router.post('/create', async (req: Request, res: Response) => {
  try {
    if (!isYooKassaConfigured()) {
      res.status(503).json({
        error: 'Оплата временно недоступна',
        hint: 'Настройте YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY на сервере',
      });
      return;
    }

    const { sessionId, amount } = req.body as { sessionId?: string; amount?: number };

    if (!sessionId) {
      res.status(400).json({ error: 'sessionId обязателен' });
      return;
    }

    const price = amount ?? config.pdfPrice;
    const payment = await createPayment(sessionId, price);

    res.json({
      paymentId: payment.paymentId,
      confirmationUrl: payment.confirmationUrl,
      amount: price,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment error';
    res.status(500).json({ error: message });
  }
});

router.get('/status/:sessionId', async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const isPaid = isYooKassaConfigured()
    ? await syncPaymentStatus(sessionId)
    : getPaymentStatus(sessionId);
  res.json({ sessionId, isPaid });
});

router.post('/webhook', (req: Request, res: Response) => {
  try {
    handleWebhookEvent(req.body);
    res.status(200).send('OK');
  } catch {
    res.status(400).json({ error: 'Invalid webhook payload' });
  }
});

export default router;
