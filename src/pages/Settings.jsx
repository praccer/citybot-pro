import { useState } from 'react';
import { useUser } from '../context/UserContext';
import Toast from '../components/Toast';
import mockData from '../data/citybot_mock_api.json';

export default function Settings() {
  const { citizen, updateName, toggleTheme, setLanguage } = useUser();
  const isEn = citizen.language === 'en';
  const t = mockData.i18n[citizen.language] || mockData.i18n.fr;
  const [nameInput, setNameInput] = useState(citizen.name);
  const [nameError, setNameError] = useState('');
  const [toast, setToast] = useState(null);

  const saveName = () => {
    if (!nameInput.trim()) { setNameError(t.error_empty); return; }
    setNameError('');
    updateName(nameInput.trim());
    setToast(isEn ? 'Name updated!' : 'Nom mis à jour !');
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="page-title">⚙️ {t.settings_title}</h1>
        <p className="page-subtitle">{isEn ? 'Customize your NeoVille experience' : 'Personnalisez votre expérience NeoVille'}</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:560 }}>

        {/* Profile */}
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
            <span style={{ fontSize:22 }}>👤</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>{isEn ? 'Profile' : 'Profil'}</h2>
          </div>
          <div className="form-group">
            <label className="form-label">{isEn ? 'Your name' : 'Votre nom'}</label>
            <div style={{ display:'flex', gap:10 }}>
              <input type="text" className={`form-input${nameError ? ' has-error' : ''}`}
                value={nameInput} onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()} style={{ flex:1 }} />
              <button className="btn btn-primary" onClick={saveName}>{isEn ? 'Save' : 'Sauvegarder'}</button>
            </div>
            {nameError && <div className="form-error">⚠ {nameError}</div>}
          </div>
          <div style={{ fontSize:12, color:'var(--text2)' }}>
            {isEn ? 'Citizen ID:' : 'ID citoyen :'} <strong>C-20320001</strong>
          </div>
        </div>

        {/* Theme */}
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <span style={{ fontSize:22 }}>🎨</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>{isEn ? 'Appearance' : 'Apparence'}</h2>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500 }}>{isEn ? 'Dark mode' : 'Mode sombre'}</div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>
                {citizen.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </div>
            </div>
            <button className="btn btn-ghost" onClick={toggleTheme} style={{ minWidth:100 }}>
              {citizen.theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <span style={{ fontSize:22 }}>🌍</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>Langue / Language</h2>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            {[{ code:'fr', label:'🇫🇷 Français' }, { code:'en', label:'🇬🇧 English' }].map(lang => (
              <button key={lang.code}
                className={`btn ${citizen.language === lang.code ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setLanguage(lang.code)}
                style={{ flex:1, justifyContent:'center' }}>
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* About NOVA */}
        <div className="card" style={{ padding:24, background:'linear-gradient(135deg,rgba(0,212,255,.05),rgba(124,58,237,.05))' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <span style={{ fontSize:22 }}>ℹ️</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:700 }}>
              {isEn ? `About ${mockData.bot.name}` : `À propos de ${mockData.bot.name}`}
            </h2>
          </div>
          <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.75 }}>
            <strong>{mockData.bot.name}</strong> — {mockData.bot.fullName}<br />
            {isEn ? 'Version' : 'Version'} {mockData.bot.version} · {mockData.bot.city}
          </p>
        </div>
      </div>
    </div>
  );
}
