import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { fakePosts } from '../data/fakePosts';
import type { Post } from '../data/fakePosts';
import type { ProfileData } from '../types/profile';
import type { MoodKey } from '../data/moods';

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
  // Aquí se guardan las emociones diarias. Ejemplo: "2026-05-13": "happy"
  dailyMoods: Record<string, MoodKey>;
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
  | { type: 'SET_POST_COMMENT'; payload: { id: number; comments: { user: string; text: string }[] } }
  // guardar emoción del día
  | {
    type: 'SET_DAILY_MOOD';
    payload: {
      date: string;
      mood: MoodKey;
    };
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
  currentUser: (savedState as AppState).currentUser ?? null,
  isAuthenticated: (savedState as AppState).isAuthenticated ?? false,
  posts: savedState.posts ?? fakePosts,
 profile: (savedState as AppState).profile ?? {
  id: '',
  name: '',
  username: '',
  email: '',
  avatar: '',
  bio: '',
  stats: { posts: 0, comments: 0, followers: 0 },
  moodVisibility: 'public',
  weekMoods: [
    { day: 'sun', mood: null, image: null, color: '#FAF7F0' },
    { day: 'mon', mood: null, image: null, color: '#FAF7F0' },
    { day: 'tue', mood: null, image: null, color: '#FAF7F0' },
    { day: 'wed', mood: null, image: null, color: '#FAF7F0' },
    { day: 'thu', mood: null, image: null, color: '#FAF7F0' },
    { day: 'fri', mood: null, image: null, color: '#FAF7F0' },
    { day: 'sat', mood: null, image: null, color: '#FAF7F0' },
  ],
},
  likedPostIds: (savedState as AppState).likedPostIds ?? [],
  postLikes: (savedState as AppState).postLikes ?? {},
  postComments: (savedState as AppState).postComments ?? {},
  // Recuperamos moods guardados en localStorage.
  // Si no existen, dejamos un objeto vacío.
  dailyMoods: (savedState as AppState).dailyMoods ?? {},
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

    // Guardar emoción diaria
    case 'SET_DAILY_MOOD':
      return {
        
        // mantenemos el resto del estado y actualizamos los moods
        ...state,dailyMoods: {

        // mantenemos moods anteriores
          ...state.dailyMoods,

          // guardamos la emoción nueva
          [action.payload.date]: action.payload.mood,}, };
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
        dailyMoods: state.dailyMoods,
      })
    );
  }, [state.activePath, state.isAuthenticated, state.posts, state.profile, state.likedPostIds, state.postLikes, state.postComments, state.currentUser, state.dailyMoods,]);

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