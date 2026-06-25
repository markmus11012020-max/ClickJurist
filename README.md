# CLICK JURIST

Экосистема анонимной юридической помощи для граждан РФ.

## Архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                        clickjurist.ru                           │
│                     (Landing — Vite/React)                      │
│              SEO, брендинг, ссылки в App Store / Google Play    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   Mobile App (Expo / React Native)              │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐ │
│  │ Wizard UI│→ │ AsyncStorage │  │ PDF Gen  │  │  Logo UI  │ │
│  │ 5 шагов  │  │  (локально)  │  │expo-print│  │  брендинг │ │
│  └────┬─────┘  └──────────────┘  └──────────┘  └───────────┘ │
└───────┼─────────────────────────────────────────────────────────┘
        │ HTTPS
┌───────▼─────────────────────────────────────────────────────────┐
│                    Backend API (Express/Node.js)                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  AI Cascade     │  │  YooKassa        │  │  Consultation │  │
│  │  Generator →    │  │  /payments/*     │  │  /consultation│  │
│  │  Editor         │  │                  │  │               │  │
│  └────────┬────────┘  └──────────────────┘  └───────────────┘  │
└───────────┼─────────────────────────────────────────────────────┘
            │
    ┌───────▼────────┐        ┌──────────────┐
    │  OpenRouter    │        │   ЮKassa     │
    │  deepseek-chat │        │   (оплата    │
    │  gemini-2.5    │        │    PDF)      │
    └────────────────┘        └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    @clickjurist/shared                          │
│   LegalCategory, AgeGroup, UserRole, ConsultationResponse, ...  │
└─────────────────────────────────────────────────────────────────┘
```

## Структура monorepo

```
КликЮрист/
├── shared/          # Общие типы, enums, константы
├── backend/         # Express API (ИИ-каскад, платежи)
├── mobile/          # Expo React Native приложение
├── landing/         # Vite лендинг clickjurist.ru
├── Logotip2.html    # Образец брендинга (логотип)
└── ТЗ приложение.txt
```

## Быстрый старт

### Требования

- Node.js 18+
- npm 9+
- Expo Go на телефоне (для мобильного приложения)

### Установка

```bash
npm install
npm run build:shared
```

### Backend

```bash
cp backend/.env.example backend/.env
# Заполните OPENROUTER_API_KEY, YOOKASSA_* в .env

npm run backend
# → http://localhost:3001
```

### Mobile

```bash
# Перед первым запуском добавьте иконки в mobile/assets/
# (icon.png 1024×1024, splash.png, adaptive-icon.png)

npm run mobile
# Сканируйте QR-код в Expo Go
```

### Landing

```bash
npm run landing
# → http://localhost:5173
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/health` | Проверка сервера |
| POST | `/api/v1/consultation` | ИИ-консультация (каскад) |
| POST | `/api/v1/payments/create` | Создание платежа ЮKassa |
| GET | `/api/v1/payments/status/:id` | Статус оплаты |
| POST | `/api/v1/payments/webhook` | Webhook ЮKassa |

## Ключевые принципы (из ТЗ)

- **Анонимность (ФЗ-152):** никаких ФИО, адресов, телефонов в ИИ
- **Бланки:** пустые поля `_______` для ручного заполнения
- **ИИ-каскад:** Генератор → Невидимый Редактор (fallback на сырой ответ)
- **Монетизация:** консультации бесплатны, PDF — 100–300 ₽

## Деплой (шаг 5)

### Landing → Vercel (clickjurist.ru)

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Import репозитория [ClickJurist](https://github.com/markmus11012020-max/ClickJurist)
3. **Root Directory:** `landing` (важно!)
4. Build / Output подхватятся из `landing/vercel.json` автоматически
5. Привяжите домен `clickjurist.ru`

Альтернатива — **Netlify**: base directory `landing`, build `npm run build`, publish `dist`.

Проверка локально:
```bash
npm run build:landing
npm run preview --workspace=landing
```

### Backend → Amvera / Timeweb Cloud

1. Создайте проект на [amvera.ru](https://amvera.ru)
2. Укажите переменные из `backend/.env.example`
3. Используйте `backend/Dockerfile` или `backend/amvera.yml`
4. Webhook ЮKassa: `https://api.clickjurist.ru/api/v1/payments/webhook`

Docker локально:
```bash
docker build -f backend/Dockerfile -t clickjurist-api .
docker run -p 3001:3001 --env-file backend/.env clickjurist-api
```

### Mobile → App Store / Google Play

```bash
npm run mobile
npx eas build --platform all   # после настройки EAS
```

В `mobile/.env` для продакшена:
```
EXPO_PUBLIC_API_URL=https://api.clickjurist.ru
```

## ЮKassa — оплата PDF (шаг 6)

1. Зарегистрируйтесь на [yookassa.ru](https://yookassa.ru) как самозанятый
2. В `backend/.env` добавьте:
   ```
   YOOKASSA_SHOP_ID=...
   YOOKASSA_SECRET_KEY=...
   FRONTEND_REDIRECT_URL=https://clickjurist.ru/payment/success.html
   ```
3. В кабинете ЮKassa → **HTTP-уведомления**:
   - URL: `https://api.clickjurist.ru/api/v1/payments/webhook`
   - Событие: `payment.succeeded`
4. Чеки в ФНС отправляет ЮKassa автоматически (ставка 4% для физлиц)

Проверка: `GET /api/v1/payments/config` → `{ "enabled": true, "price": 199 }`

## Публикация приложения — EAS Build (шаг 6)

```bash
npm install -g eas-cli
cd mobile
eas login
eas init          # создаст projectId в app.json
eas build --profile preview --platform android   # APK для теста
eas build --profile production --platform all    # App Store + Google Play
eas submit --platform ios
eas submit --platform android
```

После публикации обновите ссылки в `landing/.env`:
```
VITE_APP_STORE_URL=https://apps.apple.com/app/...
VITE_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=ru.clickjurist.app
```
