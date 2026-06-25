import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    generatorModel: process.env.GENERATOR_MODEL || 'deepseek/deepseek-chat',
    editorModel: process.env.EDITOR_MODEL || 'google/gemini-2.5-pro-preview',
    referer: 'https://clickjurist.ru',
    title: 'CLICK JURIST',
  },

  yookassa: {
    shopId: process.env.YOOKASSA_SHOP_ID || '',
    secretKey: process.env.YOOKASSA_SECRET_KEY || '',
    redirectUrl: process.env.FRONTEND_REDIRECT_URL || 'https://clickjurist.ru/payment/success',
  },

  pdfPrice: 199,

  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(','),
};
