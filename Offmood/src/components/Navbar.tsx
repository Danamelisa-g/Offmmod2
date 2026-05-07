import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
 
// ─── Iconos SVG inline ────────────────────────────────────────────────────────
 
const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
 
const IconEmoji = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
 
// ─── Componente Navbar ────────────────────────────────────────────────────────
 
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
 
  // useMemo: la lista de tabs no cambia entre renders
  const tabs = useMemo(() => [
    { id: 'feed',     label: 'Feed',     path: '/feed',     icon: <IconHome />,  isAvatar: false },
    { id: 'emotions', label: 'Emotions', path: '/emotions', icon: <IconEmoji />, isAvatar: false },
    { id: 'profile',  label: 'Profile',  path: '/profile',  icon: null,          isAvatar: true  },
  ], []);
 
  // useCallback: función estable para manejar clicks
  const handleTabClick = useCallback((path: string) => {
    dispatch({ type: 'SET_ACTIVE_PATH', payload: path });
    navigate(path);
  }, [dispatch, navigate]);
 
  return (
    <nav className="navbar" aria-label="Navegación principal">
      {tabs.map((tab) => {
        const isActive = state.activePath === tab.path;
 
        return (
          <button
            key={tab.id}
            className={`navbar__tab ${isActive ? 'navbar__tab--active' : ''}`}
            onClick={() => handleTabClick(tab.path)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.label}
          >
            <span className="navbar__tab-icon">
              {/* Si es el tab de perfil, mostrar avatar del usuario */}
              {tab.isAvatar && state.currentUser?.avatar ? (
                <img
                  src={state.currentUser.avatar}
                  alt={state.currentUser.name}
                  className={`navbar__avatar ${isActive ? 'navbar__avatar--active' : ''}`}
                />
              ) : (
                tab.icon
              )}
            </span>
            <span className="navbar__tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
 
export default Navbar;