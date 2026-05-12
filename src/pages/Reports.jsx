import { useReducer, useState } from 'react';
import { useUser } from '../context/UserContext';
import { reportsReducer, initialReportsState } from '../reducers/reportsReducer';
import Toast from '../components/Toast';
import mockData from '../data/citybot_mock_api.json';
import { categoryIcons, categoryColors } from './Home';

const statusMap = {
  Soumis:   { badge:'badge-blue',   label:'Soumis',    label_en:'Submitted' },
  'En cours':{ badge:'badge-orange', label:'En cours',  label_en:'In progress' },
  Résolu:   { badge:'badge-green',  label:'Résolu',    label_en:'Resolved' },
  Planifié: { badge:'badge-blue',   label:'Planifié',  label_en:'Planned' },
};

export default function Reports() {
  const { citizen } = useUser();
  const isEn = citizen.language === 'en';
  const t = mockData.i18n[citizen.language] || mockData.i18n.fr;

  const [state, dispatch] = useReducer(reportsReducer, initialReportsState);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ type: '', description: '', location: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.type)             e.type        = t.error_empty;
    if (!form.description.trim()) e.description = t.error_empty;
    if (!form.location.trim())  e.location    = t.error_empty;
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    dispatch({ type: 'SUBMIT_START' });

    setTimeout(() => {
      const selectedType = mockData.reportTypes.find(r => r.id === form.type);
      dispatch({
        type: 'SUBMIT_SUCCESS',
        payload: {
          id: `RPT-${Date.now()}`,
          typeId: form.type,
          typeLabel: selectedType?.label || '—',
          category: selectedType?.category || 'general',
          description: form.description,
          location: form.location,
          status: 'Soumis',
          date: new Date().toISOString().split('T')[0],
        },
      });
      setForm({ type: '', description: '', location: '' });
      setToast(t.success);
    }, mockData.simulationConfig.reportSubmitDelay);
  };

  return (
    <div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="page-title">📋 {t.report_title}</h1>
        <p className="page-subtitle">{isEn ? 'Report an issue in NeoVille' : 'Signalez un problème à NeoVille'}</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>

        {/* ── Form ── */}
        <div className="card" style={{ padding:24 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:20 }}>
            {isEn ? 'New Report' : 'Nouveau Signalement'}
          </h2>

          {/* Type — populated from reportTypes in JSON */}
          <div className="form-group">
            <label className="form-label">{isEn ? 'Problem type' : 'Type de problème'}</label>
            <select
              className={`form-select${errors.type ? ' has-error' : ''}`}
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="">{isEn ? '— Select a type —' : '— Sélectionner un type —'}</option>
              {mockData.reportTypes.map(rt => (
                <option key={rt.id} value={rt.id}>{rt.label}</option>
              ))}
            </select>
            {errors.type && <div className="form-error">⚠ {errors.type}</div>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">{isEn ? 'Description' : 'Description'}</label>
            <textarea
              className={`form-textarea${errors.description ? ' has-error' : ''}`}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder={isEn ? 'Describe the problem in detail…' : 'Décrivez le problème en détail…'}
              rows={4}
            />
            {errors.description && <div className="form-error">⚠ {errors.description}</div>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">{isEn ? 'Location' : 'Localisation'}</label>
            <input
              type="text"
              className={`form-input${errors.location ? ' has-error' : ''}`}
              value={form.location}
              onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder={isEn ? 'e.g. 12 rue de la Paix, NeoVille' : 'ex. 12 rue de la Paix, NeoVille'}
            />
            {errors.location && <div className="form-error">⚠ {errors.location}</div>}
          </div>

          <button className="btn btn-primary" onClick={handleSubmit} disabled={state.isLoading}
            style={{ width:'100%', justifyContent:'center', padding:14 }}>
            {state.isLoading ? `⏳ ${t.loading}` : `📤 ${t.report_submit}`}
          </button>
        </div>

        {/* ── History ── */}
        <div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:700, marginBottom:14 }}>
            {isEn ? 'Report History' : 'Historique'}
          </h2>

          {state.reports.length === 0 ? (
            <div className="card" style={{ padding:32, textAlign:'center', color:'var(--text2)' }}>
              {isEn ? 'No reports submitted yet.' : 'Aucun signalement soumis pour le moment.'}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {state.reports.map(r => {
                const s = statusMap[r.status] || statusMap.Soumis;
                return (
                  <div key={r.id} className="card" style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      width:38, height:38, borderRadius:8, flexShrink:0,
                      background: `${categoryColors[r.category]}22`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:20,
                    }}>
                      {categoryIcons[r.category] || '📌'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600 }}>{r.typeLabel}</div>
                      <div style={{ fontSize:12, color:'var(--text2)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {r.description}
                      </div>
                      <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>
                        📍 {r.location} · {r.date}
                      </div>
                    </div>
                    <span className={`badge ${s.badge}`}>{isEn ? s.label_en : s.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
