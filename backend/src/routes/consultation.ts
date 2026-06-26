import { Router, Request, Response } from 'express';
import { ConsultationRequest } from '../shared';
import { runAiCascade } from '../services/aiCascade';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body as ConsultationRequest;

    if (!body.form || !body.sessionId) {
      res.status(400).json({ error: 'form и sessionId обязательны' });
      return;
    }

    const result = await runAiCascade(body.form, body.clarification);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal error';
    res.status(500).json({ error: message });
  }
});

export default router;
