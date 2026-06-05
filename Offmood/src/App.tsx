import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import type { AppDispatch } from './store/index';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './components/navigation.css';
import SignUpPage from './pages/Signup/SignUpPage';
import LoginPage from './pages/Login/LoginPage';
import CreatePostPage from './pages/CreatePost/CreatePostPage';
import Home from './pages/Home';
import Profile from './pages/profile/Profile';
import EditProfilePage from './pages/profile/EditProfile';
import EmotionHistoryPage from './pages/EmotionHistory/EmotionHistoryPage';
import { useAppContext } from './store/AppContext';
import { fetchPosts } from './store/slices/postsSlice';
import { fetchUserLikes, fetchAllLikes } from './store/slices/likesSlice';
import { fetchFollowing } from './store/slices/followersSlice';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { state } = useAppContext();
  const currentUserId = state.currentUser?.id ?? '';

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchPosts());
      dispatch(fetchAllLikes());
      dispatch(fetchUserLikes(currentUserId));
      dispatch(fetchFollowing(currentUserId));
    }
  }, [dispatch, currentUserId]);

  return <>{children}</>;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAppContext();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppLayout = () => {
  const location = useLocation();
  const authPages = ['/login', '/signup'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="app-layout">
      {!isAuthPage && <Sidebar />}
      <main className={isAuthPage ? 'app-main-auth' : 'app-main'}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/feed" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/emotions" element={<PrivateRoute><EmotionHistoryPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/edit" element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
          <Route path="/create-post" element={<PrivateRoute><CreatePostPage /></PrivateRoute>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/feed" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Navbar />}
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <AppInitializer>
        <AppLayout />
      </AppInitializer>
    </BrowserRouter>
  </AppProvider>
);

export default App;