//useCallback y useMemo son herramientas de optimización evitan que React rehaga trabajo innecesario.
import React, { useCallback, useMemo } from 'react';
//useNavigate es el "GPS" de la app — le dice al navegador a qué página ir.
import { useNavigate } from 'react-router-dom';
//ruta de react que es una dependencia 
//useAppContext es el "cerebro global"segun si se guarda el usuario o esta logueado
// dice en que pagina estas y todo eso 
import { useAppContext } from '../store/AppContext';
 
// aqui van los iconos e incluimos el css y hmtl
 //este el home 
const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
 //donde va e; icon enoji 
const IconEmoji = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
 
// Componente Navbar 
//declaramos que el componenete es funciional y reliazmos una funcion
 
const Navbar: React.FC = () => {
  const navigate = useNavigate();//es un hook de React Router
  const { state, dispatch } = useAppContext();
 
 //useMemoes comouna lista que creamos 1 vez para que no se renderize cada rato 
 //Cada tab tiene: id (nombre único), path (ruta a la que va), icon (el SVG) e isAvatar (si muestra la foto del usuario).
 //osea en pocas palabra aqui defini muchacho estructura aqui van las rutas
  const tabs = useMemo(() => [
    { id: 'feed',     label: 'Feed',     path: '/feed',     icon: <IconHome />,  isAvatar: false },
    { id: 'emotions', label: 'Emotions', path: '/emotions', icon: <IconEmoji />, isAvatar: false },
    { id: 'profile',  label: 'Profile',  path: '/profile',  icon: null,          isAvatar: true  },
  ], []);
 
  // useCallback: función estable para manejar clicks
  const handleTabClick = useCallback((path: string) => {
    dispatch({ type: 'SET_ACTIVE_PATH', payload: path });//SET_ACTIVE_PATH le avisa al contexto global "ahora estoy en esta ruta", para que el tab se ilumine de azul
    navigate(path);
  }, [dispatch, navigate]);//navegate path cambia la URL del navegador y muestra la página correspondiente.
 
  return (
    <nav className="navbar" aria-label="Navegación principal">
      {tabs.map((tab) => {//tabs.map() recorre la lista de 3 tabs y crea un botón por cada uno generando un bucle. 
        const isActive = state.activePath === tab.path;//sActive compara la ruta guardada en el contexto con la del tab. Si coinciden, agrega la clase navbar__tab--active que lo pone azul.
 
        return (
          <button//key={tab.id}React necesita un identificador único en cada elemento de un map para saber cuál actualizar.
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