import cors from 'cors';
import express from 'express';
import { config } from './config';
import consultationRouter from './routes/consultation';
import paymentsRouter from './routes/payments';
import { getConfigStatus } from './validateConfig';

const app = express();

app.use(
  cors({
    origin: config.allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  const status = getConfigStatus();
  res.json({
    status: 'ok',
    service: 'CLICK JURIST API',
    config: {
      openrouter: status.openrouter,
      yookassa: status.yookassa,
      ready: status.ready,
    },
  });
});

app.get('/health/config', (_req, res) => {
  const status = getConfigStatus();
  res.json(status);
});

app.use('/api/v1/consultation', consultationRouter);
app.use('/api/v1/payments', paymentsRouter);

const status = getConfigStatus();
if (!status.ready) {
  console.warn('⚠️  Не настроен OPENROUTER_API_KEY — см. backend/.env');
  status.missing.forEach((item) => console.warn(`   → ${item}`));
}

app.listen(config.port, () => {
  console.log(`CLICK JURIST API → http://localhost:${config.port}`);
});
