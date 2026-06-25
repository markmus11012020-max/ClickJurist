import './Logo.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function Logo({ size = 'md', showTagline = true }: LogoProps) {
  return (
    <div className={`logo-container logo-${size}`}>
      <svg className="shield-bg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M65,60 C65,60,50,65,50,85 C50,115,100,145,100,145 C100,145,150,115,150,85 C150,65,135,60,135,60 L65,60 Z" />
      </svg>

      <img
        className="scales-img"
        src="https://cdn-icons-png.flaticon.com/512/18569/18569911.png"
        alt="Весы правосудия"
      />

      <h1 className="brand-name">
        CLICK<span className="brand-highlight">JURIST</span>
      </h1>

      {showTagline && <p className="tagline">Instant Legal Authority</p>}
    </div>
  );
}
