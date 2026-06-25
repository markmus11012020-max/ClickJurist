import { Logo } from './components/Logo';
import './App.css';

const FEATURES = [
  {
    title: 'Полная анонимность',
    desc: 'Никаких ФИО, адресов и телефонов. Соответствие ФЗ-152.',
  },
  {
    title: 'Понятные ответы',
    desc: 'Юридические термины объясняются простым языком для любого возраста.',
  },
  {
    title: 'Анонимные бланки',
    desc: 'PDF-документы с пустыми полями — заполните ручкой после печати.',
  },
  {
    title: '7 сфер права',
    desc: 'От судебных приказов до экстренных памяток по ст. 51 Конституции.',
  },
];

const STORE_LINKS = {
  ios: import.meta.env.VITE_APP_STORE_URL || '#',
  android: import.meta.env.VITE_PLAY_STORE_URL || '#',
};

const CATEGORIES = [
  'Судебные приказы',
  'Трудовые споры',
  'Права потребителей',
  'Жилищные споры',
  'КоАП РФ',
  'УК РФ — пострадавший',
  'Экстренное задержание',
];

export default function App() {
  return (
    <div className="page">
      <header className="hero">
        <Logo size="lg" />
        <p className="hero-subtitle">
          Анонимная юридическая помощь для граждан России.
          Консультации бесплатно, бланки документов — от 100 ₽.
        </p>
        <div className="store-buttons">
          <a href={STORE_LINKS.ios} className="store-btn" aria-label="Скачать в App Store">
            App Store
          </a>
          <a href={STORE_LINKS.android} className="store-btn" aria-label="Скачать в Google Play">
            Google Play
          </a>
        </div>
      </header>

      <section className="features">
        <h2>Почему CLICK JURIST</h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="categories">
        <h2>Юридические сферы</h2>
        <ul className="category-list">
          {CATEGORIES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="how-it-works">
        <h2>Как это работает</h2>
        <ol className="steps">
          <li>Укажите возраст и роль в ситуации</li>
          <li>Опишите проблему своими словами</li>
          <li>Получите проверенную консультацию</li>
          <li>При необходимости скачайте анонимный бланк</li>
        </ol>
      </section>

      <footer className="footer">
        <Logo size="sm" showTagline={false} />
        <p>© 2026 CLICK JURIST · clickjurist.ru</p>
        <p className="footer-note">
          Сервис не заменяет профессиональную юридическую помощь.
          Персональные данные не собираются и не хранятся.
        </p>
      </footer>
    </div>
  );
}
