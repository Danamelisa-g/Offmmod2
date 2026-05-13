import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fakePosts } from '../data/fakePosts';
import type { Post } from '../data/fakePosts';
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
  posts: Post[];
  profile: ProfileData;
  likedPostIds: number[];
  postLikes: Record<number, number>;
  postComments: Record<number, { user: string; text: string }[]>;
}

// ── Acciones ───────────────────────────────────────────────────
type AppAction =
  | { type: 'SET_ACTIVE_PATH'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'DELETE_POST'; payload: number }
  | { type: 'UPDATE_PROFILE'; payload: Partial<ProfileData> }
  | { type: 'TOGGLE_LIKE'; payload: number }
  | { type: 'SET_POST_LIKES'; payload: { id: number; count: number } }
  | { type: 'SET_POST_COMMENT'; payload: { id: number; comments: { user: string; text: string }[] } };

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
  currentUser: (savedState as AppState).currentUser ?? MOCK_USER,
  isAuthenticated: true,
  posts: savedState.posts ?? fakePosts,
  profile: (savedState as AppState).profile ?? (mockData.profile as ProfileData),
  likedPostIds: (savedState as AppState).likedPostIds ?? [],
  postLikes: (savedState as AppState).postLikes ?? {},
  postComments: (savedState as AppState).postComments ?? {},
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
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter(p => p.id !== action.payload) };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
        currentUser: state.currentUser
          ? {
              ...state.currentUser,
              name: action.payload.name ?? state.currentUser.name,
              avatar: action.payload.avatar ?? state.currentUser.avatar,
            }
          : null,
      };
      case 'TOGGLE_LIKE': {
      const isLiked = state.likedPostIds.includes(action.payload);
      return {
        ...state,
        likedPostIds: isLiked
          ? state.likedPostIds.filter(id => id !== action.payload)
          : [...state.likedPostIds, action.payload],
      };
    }
    case 'SET_POST_LIKES':
      return { ...state, postLikes: { ...state.postLikes, [action.payload.id]: action.payload.count } };

    case 'SET_POST_COMMENT':
      return { ...state, postComments: { ...state.postComments, [action.payload.id]: action.payload.comments } };
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
        posts: state.posts,
        profile: state.profile,
        likedPostIds: state.likedPostIds,
        postLikes: state.postLikes,
        postComments: state.postComments,
        currentUser: state.currentUser,
      })
    );
  }, [state.activePath, state.isAuthenticated, state.posts, state.profile, state.likedPostIds, state.postLikes, state.postComments, state.currentUser]);

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