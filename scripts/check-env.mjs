import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../backend/.env');

dotenv.config({ path: envPath });

const apiKey = process.env.OPENROUTER_API_KEY?.trim() || '';
const openrouter = Boolean(apiKey && apiKey !== 'your_openrouter_api_key');
const yookassa = Boolean(
  process.env.YOOKASSA_SHOP_ID?.trim() && process.env.YOOKASSA_SECRET_KEY?.trim(),
);

console.log('\n=== CLICK JURIST — проверка .env ===\n');
console.log(`Файл:            ${envPath}`);
console.log(`Порт API:        ${process.env.PORT || '3001'}`);
console.log(`OpenRouter:      ${openrouter ? '✓ настроен' : '✗ не настроен'}`);
console.log(`ЮKassa:          ${yookassa ? '✓ настроен' : '○ не настроен (опционально)'}`);
console.log(`Генератор:       ${process.env.GENERATOR_MODEL || 'deepseek/deepseek-chat'}`);
console.log(`Редактор:        ${process.env.EDITOR_MODEL || 'google/gemini-2.5-pro-preview'}`);

if (!openrouter) {
  console.log('\nЗаполните в backend/.env:');
  console.log('  OPENROUTER_API_KEY=sk-or-v1-...');
  console.log('  Ключ: https://openrouter.ai/keys');
}

if (!yookassa) {
  console.log('\nДля оплаты PDF (позже):');
  console.log('  YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY');
  console.log('  Кабинет: https://yookassa.ru');
}

console.log('\nМобильное приложение: mobile/.env');
console.log('  EXPO_PUBLIC_API_URL=http://localhost:3001');
console.log('  На телефоне замените localhost на IP компьютера в Wi‑Fi\n');

process.exit(openrouter ? 0 : 1);
