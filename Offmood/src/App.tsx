import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

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


const AppLayout = () => {

  const location = useLocation();

  // Se definen las rutas que NO deben
  // mostrar navegación principal.
  const authPages = [
    '/login',
    '/signup',
  ];

  const isAuthPage =
    authPages.includes(location.pathname);

  return (

    <div className="app-layout">

      {/* Sidebar solo aparece fuera de auth */}
      {!isAuthPage && <Sidebar />}

      <main className={isAuthPage ? 'app-main-auth' : 'app-main'}>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/feed" replace />}
          />

          <Route
            path="/feed"
            element={<Home />}
          />

          <Route
            path="/emotions"
            element={<EmotionHistoryPage />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/profile/edit"
            element={<EditProfilePage />}
          />

          <Route
            path="/create-post"
            element={<CreatePostPage />}
          />

          <Route
            path="/signup"
            element={<SignUpPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="*"
            element={<Navigate to="/feed" replace />}
          />

        </Routes>

      </main>

      {/* Navbar mobile solo fuera de auth */}
      {!isAuthPage && <Navbar />}

    </div>
  );
};


const App: React.FC = () => (

  <AppProvider>

    <BrowserRouter>

      <AppLayout />

    </BrowserRouter>

  </AppProvider>
);

export default App;