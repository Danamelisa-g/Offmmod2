import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './components/navigation.css';
import SignUpPage from './pages/Signup/SignUpPage';
import CreatePostPage from './pages/CreatePost/CreatePostPage';
import Home from './pages/Home';
import Profile from './pages/profile/Profile';
import EditProfilePage from './pages/profile/EditProfile';

const EmotionsPage = () => (
  <div style={{ padding: '32px' }}>
    <h2 style={{ color: '#2d2d2d' }}>Emotion History</h2>
    <p style={{ color: '#8a8a8a' }}>Aquí irá el historial de emociones.</p>
  </div>
);

const App: React.FC = () => (
  <AppProvider>
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/"             element={<Navigate to="/feed" replace />} />
            <Route path="/feed"         element={<Home />} />
            <Route path="/emotions"     element={<EmotionsPage />} />
            <Route path="/profile"      element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/create-post"  element={<CreatePostPage />} />
            <Route path="/signup"       element={<SignUpPage />} />
            <Route path="*"             element={<Navigate to="/feed" replace />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </BrowserRouter>
  </AppProvider>
);

export default App;