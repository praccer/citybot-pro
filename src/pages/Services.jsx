import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { SkeletonCard } from '../components/SkeletonLoader';
import mockData from '../data/citybot_mock_api.json';
import { categoryIcons, categoryColors } from './Home';

export default function Services() {
  const { citizen } = useUser();
  const isEn = citizen.language === 'en';
  const t = mockData.i18n[citizen.language] || mockData.i18n.fr;
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    const { min, max } = mockData.simulationConfig.fetchDelay;
    const delay = min + Math.random() * (max - min);
    const timer = setTimeout(() => {
      try { setServices(mockData.services); }
      catch { setError(isEn ? 'Failed to load services.' : 'Erreur de chargement.'); }
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [isEn]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🏛️ {t.services_title}</h1>
        <p className="page-subtitle">{isEn ? 'All NeoVille departments' : 'Tous les services municipaux de NeoVille'}</p>
      </div>

      {error && (
        <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid var(--error)', borderRadius:8, padding:16, color:'var(--error)', marginBottom:20 }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
        {loading
          ? Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)
          : services.map(s => (
              <div key={s.id} className="card" onClick={() => navigate(`/services/${s.id}`)}
                style={{ padding:24, cursor:'pointer', borderTop:`4px solid ${categoryColors[s.category]||'#888'}` }}>
                <div style={{ fontSize:36, marginBottom:12 }}>{categoryIcons[s.category]||'🏛️'}</div>
                <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:6 }}>{s.name}</h3>
                <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:14 }}>{s.description}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  {s.urgence
                    ? <span className="badge badge-red">🚨 Urgence 24h/24</span>
                    : <span style={{ fontSize:11, color:'var(--text2)' }}>🕐 {s.horaires}</span>}
                  <span style={{ fontSize:12, color:'var(--accent)', fontWeight:600 }}>
                    {isEn ? 'Details →' : 'Voir →'}
                  </span>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}
