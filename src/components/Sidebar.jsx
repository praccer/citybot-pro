import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const navItems = [
  { to: '/', icon: '🏠', label: 'Accueil', label_en: 'Home', end: true },
  { to: '/chat', icon: '💬', label: 'Chat NOVA', label_en: 'Chat NOVA' },
  { to: '/signalements', icon: '📋', label: 'Signalements', label_en: 'Reports' },
  { to: '/services', icon: '🏛️', label: 'Services', label_en: 'Services' },
  { to: '/parametres', icon: '⚙️', label: 'Paramètres', label_en: 'Settings' },
];

export default function Sidebar() {
  const { citizen } = useUser();
  const isEn = citizen.language === 'en';
  const initials = citizen.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          NOVA <span className="logo-mark-text" style={{ fontWeight: 400, fontSize: 14 }}>by NeoVille</span>
        </div>
        <div className="logo-sub">{isEn ? 'Citizen Portal' : 'Portail Citoyen'}</div>
      </div>

      <nav className="nav-items">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{isEn ? item.label_en : item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="citizen-badge">
          <div className="citizen-avatar">{initials}</div>
          <div>
            <div className="citizen-name">{citizen.name}</div>
            <div className="citizen-id">C-20320001</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
