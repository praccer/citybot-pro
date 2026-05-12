import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { SkeletonCard } from '../components/SkeletonLoader';
import mockData from '../data/citybot_mock_api.json';

export const categoryIcons  = { voirie:'🛣️', transport:'🚌', environnement:'🌿', securite:'🛡️', sante:'🏥', education:'📚', general:'📌' };
export const categoryColors = { voirie:'#FF6B35', transport:'#4ECDC4', environnement:'#6BCB77', securite:'#FF4D6D', sante:'#60a5fa', education:'#f59e0b', general:'#94a3b8' };

function randDelay() {
  const { min, max } = mockData.simulationConfig.fetchDelay;
  return min + Math.random() * (max - min);
}

export default function Home() {
  const { citizen } = useUser();
  const navigate = useNavigate();
  const isEn = citizen.language === 'en';
  const t = mockData.i18n[citizen.language] || mockData.i18n.fr;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => { setServices(mockData.services); setLoading(false); }, randDelay());
    return () => clearTimeout(timer);
  }, []);

  const greet = () => {
    const h = new Date().getHours();
    if (isEn) return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(0,212,255,.08),rgba(124,58,237,.08))',
        border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '32px 36px', marginBottom: 32,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:'radial-gradient(circle,rgba(0,212,255,.12),transparent 70%)', borderRadius:'50%' }} />
        <div style={{ fontSize:11, color:'var(--accent)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.12em', marginBottom:8 }}>
          {mockData.bot.city} · {mockData.bot.name} v{mockData.bot.version}
        </div>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:30, fontWeight:800, marginBottom:8 }}>
          {greet()}, {citizen.name} 👋
        </h1>
        <p style={{ color:'var(--text2)', fontSize:15, maxWidth:500, lineHeight:1.7 }}>
          {isEn
            ? `Welcome to ${mockData.bot.city}! I'm ${mockData.bot.name} (${mockData.bot.fullName}) — your intelligent municipal assistant.`
            : `${t.welcome} Je suis ${mockData.bot.name} (${mockData.bot.fullName}) — votre assistante municipale intelligente.`}
        </p>
        <div style={{ display:'flex', gap:12, marginTop:20, flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/chat')}>
            💬 {isEn ? `Chat with ${mockData.bot.name}` : `Discuter avec ${mockData.bot.name}`}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/signalements')}>
            📋 {isEn ? 'Report an Issue' : 'Signaler un problème'}
          </button>
        </div>
      </div>

      {/* Services grid */}
      <div className="page-header">
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>{t.services_title}</h2>
        <p className="page-subtitle">{isEn ? 'Click a service for details' : 'Cliquez sur un service pour plus d\'infos'}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
        {loading
          ? Array.from({length:6}).map((_,i) => <SkeletonCard key={i} />)
          : services.map(s => (
              <div key={s.id} className="card" onClick={() => navigate(`/services/${s.id}`)}
                style={{ padding:20, cursor:'pointer', borderLeft:`4px solid ${categoryColors[s.category]||'#888'}` }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{categoryIcons[s.category]||'🏛️'}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:6 }}>{s.name}</div>
                <div style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5 }}>{s.description}</div>
                {s.urgence && <div style={{ marginTop:8 }}><span className="badge badge-red">🚨 Urgence</span></div>}
              </div>
            ))
        }
      </div>
    </div>
  );
}
