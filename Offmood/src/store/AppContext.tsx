import React, { createContext, useContext, useReducer, useEffect } from 'react';

//definen los tipos 
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
 
interface AppState {
  activePath: string;
  sidebarOpen: boolean;
  currentUser: User | null;
  isAuthenticated: boolean;
}
 
type AppAction =
  | { type: 'SET_ACTIVE_PATH'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' };

//datos mockeados
  const MOCK_USER: User = {
  id: '1',
  name: 'Adam Smith',
  email: 'adam@offmood.com',
  avatar: 'https://i.pravatar.cc/40?img=3',
};

// ─── Estado inicial ───────────────────────────────────────────────────────────
// Leemos localStorage para persistir entre recargas
 
const loadFromStorage = (): Partial<AppState> => {
  try {
    const saved = localStorage.getItem('offmood-state');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};
 
const savedState = loadFromStorage();
 
const initialState: AppState = {
  activePath: savedState.activePath ?? '/feed',
  sidebarOpen: false, // el sidebar siempre empieza cerrado
  currentUser: MOCK_USER,
  isAuthenticated: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_PATH':
      return { ...state, activePath: action.payload };
 
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
 
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
 
    case 'SET_USER':
      return { ...state, currentUser: action.payload, isAuthenticated: true };
 
    case 'LOGOUT':
      return { ...state, currentUser: null, isAuthenticated: false };
 
    default:
      return state;
  }
}
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
 
const AppContext = createContext<AppContextType | undefined>(undefined);
 
// ─── Provider ─────────────────────────────────────────────────────────────────
 
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
 
  // Persistir en localStorage cada vez que el estado cambia
  useEffect(() => {
    localStorage.setItem(
      'offmood-state',
      JSON.stringify({
        activePath: state.activePath,
        isAuthenticated: state.isAuthenticated,
      })
    );
  }, [state.activePath, state.isAuthenticated]);
 
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
 
// ─── Hook personalizado para usar el contexto ─────────────────────────────────
 
// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de <AppProvider>');
  }
  return context;
};