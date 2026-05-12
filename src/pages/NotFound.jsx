import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { citizen } = useUser();
  const isEn = citizen.language === 'en';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🏙️</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 800,
        background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        lineHeight: 1,
      }}>404</h1>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, margin: '12px 0 8px' }}>
        {isEn ? 'Page not found' : 'Page introuvable'}
      </h2>
      <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 360, lineHeight: 1.7, marginBottom: 28 }}>
        {isEn
          ? 'This sector of NeoVille doesn\'t seem to exist yet. Return to the citizen portal.'
          : 'Ce secteur de NeoVille ne semble pas encore exister. Retournez au portail citoyen.'}
      </p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>
        🏠 {isEn ? 'Back to Home' : 'Retour à l\'accueil'}
      </button>
    </div>
  );
}
