import { useReducer, useRef, useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { chatReducer, initialChatState } from '../reducers/chatReducer';
import { ChatSkeleton } from '../components/SkeletonLoader';
import mockData from '../data/citybot_mock_api.json';

// ── Bot logic: match triggers from real JSON ──────────────────────────────────
function getBotResponse(text) {
  const lower = text.toLowerCase();

  // Find first response whose triggers array has a match
  const matched = mockData.responses.find(r =>
    r.triggers.length > 0 && r.triggers.some(trigger => lower.includes(trigger))
  );

  if (matched) return matched.message;

  // Fallback to defaultResponses randomly
  const defaults = mockData.defaultResponses;
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function typingDelay() {
  const { min, max } = mockData.simulationConfig.typingDelay;
  return min + Math.random() * (max - min);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Message({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:16, flexDirection: isBot ? 'row' : 'row-reverse' }}>
      {isBot && (
        <div style={{
          width:36, height:36, borderRadius:'50%', flexShrink:0,
          background:'linear-gradient(135deg,var(--accent),var(--accent2))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:14, fontWeight:700, color:'#fff', fontFamily:'var(--font-display)',
        }}>N</div>
      )}
      <div style={{
        maxWidth:'72%',
        background: isBot ? 'var(--card)' : 'linear-gradient(135deg,var(--accent),#0099bb)',
        color: isBot ? 'var(--text)' : '#000',
        padding:'12px 16px',
        borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        fontSize:14, lineHeight:1.65,
        border: isBot ? '1px solid var(--border)' : 'none',
      }}>
        {msg.text}
        <div style={{ fontSize:10, opacity:.45, marginTop:4, textAlign: isBot ? 'left' : 'right' }}>
          {new Date(msg.timestamp).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
}

// Quick-action chips mapped to real trigger words
const quickActions = [
  { label:'🛣️ Voirie',       msg:'nid de poule sur la route' },
  { label:'🚌 Transport',    msg:'probleme bus ligne retard' },
  { label:'🌿 Environnement',msg:'depot sauvage ordures dechet' },
  { label:'🛡️ Urgence',      msg:'urgence securite danger' },
  { label:'📋 Signalement',  msg:'signaler un incident' },
  { label:'🕐 Horaires',     msg:'quels sont les horaires d ouverture' },
];

// ── Main component ────────────────────────────────────────────────────────────
export default function Chat() {
  const { citizen } = useUser();
  const isEn = citizen.language === 'en';
  const t = mockData.i18n[citizen.language] || mockData.i18n.fr;
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialChatState,
    messages: [{
      id: 'welcome',
      role: 'bot',
      text: mockData.responses.find(r => r.id === 'nova-001').message,
      timestamp: new Date().toISOString(),
    }],
  });
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [state.messages, state.isLoading]);

  const send = (text) => {
    const msg = (text ?? input).trim();
    if (!msg || state.isLoading) return;
    setInput('');
    dispatch({ type:'SEND_MESSAGE', payload:msg });

    setTimeout(() => {
      try {
        dispatch({ type:'RECEIVE_RESPONSE', payload: getBotResponse(msg) });
      } catch {
        dispatch({ type:'SET_ERROR', payload: isEn ? 'Connection error. Please try again.' : 'Erreur de connexion. Réessayez.' });
      }
    }, typingDelay());
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 64px)', maxHeight:700 }}>
      {/* Header */}
      <div className="page-header" style={{ flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:44, height:44, borderRadius:'50%',
            background:'linear-gradient(135deg,var(--accent),var(--accent2))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:20, fontWeight:700, color:'#fff', fontFamily:'var(--font-display)',
          }}>N</div>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:800 }}>
              {mockData.bot.name}
            </h1>
            <div style={{ fontSize:11, color:'var(--text2)' }}>
              {mockData.bot.fullName}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--success)', animation:'pulse 2s infinite' }} />
              <span style={{ fontSize:11, color:'var(--success)', fontWeight:500 }}>
                {isEn ? 'Online' : 'En ligne'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14, flexShrink:0 }}>
        {quickActions.map(q => (
          <button key={q.label} className="btn btn-ghost"
            style={{ fontSize:12, padding:'5px 11px' }}
            onClick={() => send(q.msg)}>
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex:1, overflowY:'auto',
        background:'var(--bg2)', borderRadius:'var(--radius)',
        border:'1px solid var(--border)', padding:20, marginBottom:14,
      }}>
        {state.messages.map(msg => <Message key={msg.id} msg={msg} />)}
        {state.isLoading && <ChatSkeleton />}
        {state.error && (
          <div style={{ background:'rgba(239,68,68,.1)', border:'1px solid var(--error)', borderRadius:8, padding:'12px 16px', color:'var(--error)', fontSize:14 }}>
            ⚠️ {state.error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display:'flex', gap:10, flexShrink:0 }}>
        <textarea
          ref={inputRef}
          className="form-textarea"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={t.chat_placeholder}
          rows={2}
          style={{ resize:'none', flex:1 }}
          disabled={state.isLoading}
        />
        <button className="btn btn-primary"
          onClick={() => send()}
          disabled={!input.trim() || state.isLoading}
          style={{ alignSelf:'flex-end', padding:'12px 20px' }}>
          {state.isLoading ? '...' : t.send}
        </button>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}
