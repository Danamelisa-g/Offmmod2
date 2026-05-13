import React, { useCallback, useMemo, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import logo from '../assets/Frame 20.png';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
}

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconEmoji = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const IconPlus = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();

  const navItems: NavItem[] = useMemo(() => [
    { id: 'feed',     label: 'Feed',            path: '/feed',     icon: <IconHome /> },
    { id: 'emotions', label: 'Emotion History', path: '/emotions', icon: <IconEmoji /> },
  ], []);

  const handleNavClick = useCallback((path: string) => {
    dispatch({ type: 'SET_ACTIVE_PATH', payload: path });
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
    navigate(path);
  }, [dispatch, navigate]);

  const handleCreatePost = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_PATH', payload: '/create-post' });
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
    navigate('/create-post');
  }, [dispatch, navigate]);

  /* navegar al perfil al hacer click en el usuario*/
  const handleProfileClick = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_PATH', payload: '/profile' });
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
    navigate('/profile');
  }, [dispatch, navigate]);

  const handleLogout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }, [dispatch, navigate]);

  const isProfileActive = state.activePath === '/profile' || state.activePath === '/profile/edit';

  

  return (
    <>
      {state.sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false })}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${state.sidebarOpen ? 'sidebar--open' : ''}`}>

        {/* Logo */}
        <div className="sidebar__logo">
          <img src={logo} alt="Offmood Logo" className="sidebar__logo-img" />
        </div>

        {/* Nav links */}
        <nav className="sidebar__nav">
          {navItems.map((item) => {
            const isActive = state.activePath === item.path;
            return (
              <button
                key={item.id}
                className={`sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`}
                onClick={() => handleNavClick(item.path)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span className="sidebar__nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Create Post */}
        <button className="sidebar__create-btn" onClick={handleCreatePost}>
          <IconPlus />
          <span>Create Post</span>
        </button>

        <div className="sidebar__spacer" />

        {/* Footer: usuario clickeable → /profile + logout */}
        <div className="sidebar__footer">
          {state.currentUser && (
            <button
              className={`sidebar__user sidebar__user--btn ${isProfileActive ? 'sidebar__user--active' : ''}`}
              onClick={handleProfileClick}
              title="Ver perfil"
            >
              {/* Barra azul activa */}
              {isProfileActive && <span className="sidebar__user-indicator" />}
              <img
                src={state.currentUser.avatar}
                alt={state.currentUser.name}
                className="sidebar__user-avatar"
              />
              <span className="sidebar__user-name">{state.currentUser.name}</span>
            </button>
          )}

          <button className="sidebar__logout-btn" onClick={handleLogout}>
            <IconLogout />
            <span>Log out</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;