import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ProfileData } from '../types/profile';
import mockData from '../services/mockData.json';

// ── Tipos base del usuario de sesión ──────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// ── Estado global ──────────────────────────────────────────────
interface AppState {
  activePath: string;
  sidebarOpen: boolean;
  currentUser: User | null;
  isAuthenticated: boolean;
  profile: ProfileData;           // datos completos del perfil
}

// ── Acciones ───────────────────────────────────────────────────
type AppAction =
  | { type: 'SET_ACTIVE_PATH'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<ProfileData> };

// ── Mock user de sesión ────────────────────────────────────────
const MOCK_USER: User = {
  id: '1',
  name: 'Adam Smith',
  email: 'adam@offmood.com',
  avatar: 'https://i.pravatar.cc/40?img=3',
};

// ── Persistencia ───────────────────────────────────────────────
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
  sidebarOpen: false,
  currentUser: MOCK_USER,
  isAuthenticated: true,
  profile: (savedState as AppState).profile ?? (mockData.profile as ProfileData),
};

// ── Reducer ────────────────────────────────────────────────────
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
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
        // Sincronizamos el avatar/nombre en currentUser también
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              name: action.payload.name ?? state.currentUser.name,
              avatar: action.payload.avatar ?? state.currentUser.avatar,
            }
          : null,
      };
    default:
      return state;
  }
}

// ── Contexto ───────────────────────────────────────────────────
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    localStorage.setItem(
      'offmood-state',
      JSON.stringify({
        activePath: state.activePath,
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
      })
    );
  }, [state.activePath, state.isAuthenticated, state.profile]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext debe usarse dentro de <AppProvider>');
  return context;
};