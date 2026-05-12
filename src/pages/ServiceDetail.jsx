import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import SkeletonLoader from '../components/SkeletonLoader';
import mockData from '../data/citybot_mock_api.json';
import { categoryIcons, categoryColors } from './Home';

export default function ServiceDetail() {
  const { id } = useParams();                   // e.g. "svc-001"
  const navigate = useNavigate();
  const { citizen } = useUser();
  const isEn = citizen.language === 'en';
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    const { min, max } = mockData.simulationConfig.fetchDelay;
    const delay = min + Math.random() * (max - min);
    const timer = setTimeout(() => {
      const found = mockData.services.find(s => s.id === id);
      found ? setService(found) : setError(isEn ? `Service "${id}" not found.` : `Service "${id}" introuvable.`);
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [id, isEn]);

  const back = () => navigate('/services');

  if (loading) return (
    <div>
      <button className="btn btn-ghost" style={{ marginBottom:24 }} onClick={back}>
        ← {isEn ? 'Back' : 'Retour'}
      </button>
      <div className="card" style={{ padding:32 }}>
        <div className="skeleton" style={{ height:52, width:52, borderRadius:10, marginBottom:20 }} />
        <div className="skeleton" style={{ height:26, width:'50%', marginBottom:14 }} />
        <SkeletonLoader lines={4} height={13} gap={10} />
      </div>
    </div>
  );

  if (error || !service) return (
    <div>
      <button className="btn btn-ghost" style={{ marginBottom:24 }} onClick={back}>
        ← {isEn ? 'Back' : 'Retour'}
      </button>
      <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid var(--error)', borderRadius:'var(--radius)', padding:40, textAlign:'center' }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
        <h2 style={{ fontFamily:'var(--font-display)', color:'var(--error)', marginBottom:8 }}>404</h2>
        <p style={{ color:'var(--text2)', fontSize:14 }}>{error}</p>
      </div>
    </div>
  );

  const color = categoryColors[service.category] || '#888';
  const icon  = categoryIcons[service.category]  || '🏛️';

  const infoCards = [
    { icon:'🕐', label: isEn ? 'Hours'   : 'Horaires', value: service.horaires   },
    { icon:'📧', label: isEn ? 'Email'   : 'Email',    value: service.contact    },
    { icon:'📞', label: isEn ? 'Phone'   : 'Téléphone',value: service.telephone  },
    { icon:'🗂️', label: isEn ? 'Category': 'Catégorie',value: service.category   },
  ];

  return (
    <div>
      <button className="btn btn-ghost" style={{ marginBottom:24 }} onClick={back}>
        ← {isEn ? 'Back to Services' : 'Retour aux Services'}
      </button>

      {/* Hero card */}
      <div className="card" style={{ padding:36, marginBottom:20, borderTop:`5px solid ${color}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:18 }}>
          <div style={{ fontSize:52, width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg3)', borderRadius:16 }}>
            {icon}
          </div>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800 }}>{service.name}</h1>
            <div style={{ marginTop:6, display:'flex', gap:8, flexWrap:'wrap' }}>
              <span className="badge badge-blue">{service.category}</span>
              {service.urgence && <span className="badge badge-red">🚨 Urgence 24h/24</span>}
            </div>
          </div>
        </div>
        <p style={{ fontSize:15, color:'var(--text2)', lineHeight:1.75, maxWidth:640 }}>
          {service.description}
        </p>
      </div>

      {/* Info cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14, marginBottom:24 }}>
        {infoCards.map(info => (
          <div key={info.label} className="card" style={{ padding:18 }}>
            <div style={{ fontSize:22, marginBottom:8 }}>{info.icon}</div>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>{info.label}</div>
            <div style={{ fontSize:13, color:'var(--text)', lineHeight:1.5 }}>{info.value}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
        <button className="btn btn-primary" onClick={() => navigate('/signalements')}>
          📋 {isEn ? 'Submit a Report' : 'Faire un signalement'}
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/chat')}>
          💬 {isEn ? `Ask ${mockData.bot.name}` : `Demander à ${mockData.bot.name}`}
        </button>
      </div>
    </div>
  );
}
