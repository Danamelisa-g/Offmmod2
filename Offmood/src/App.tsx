import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './components/navigation.css';
 
// ── Importa tus páginas aquí cuando las tengas ─────────────────────────────
// import FeedPage from './pages/FeedPage';
// import EmotionsPage from './pages/EmotionsPage';
// import ProfilePage from './pages/ProfilePage';
// import CreatePostPage from './pages/CreatePostPage';
 
// ── Placeholder temporal mientras creas las páginas ───────────────────────
const FeedPage = () => <h1 style={{ padding: '24px' }}>Feed</h1>;
const EmotionsPage = () => <h1 style={{ padding: '24px' }}>Emotion History</h1>;
const ProfilePage = () => <h1 style={{ padding: '24px' }}>Profile</h1>;
const CreatePostPage = () => <h1 style={{ padding: '24px' }}>Create Post</h1>;
 
// ─── Componente principal ─────────────────────────────────────────────────────
 
const App: React.FC = () => {
  return (
    // AppProvider envuelve toda la app para que useAppContext funcione en cualquier componente
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
 
          {/* Sidebar: visible en desktop, deslizable en móvil */}
          <Sidebar />
 
          {/* Contenido principal de la app */}
          <main className="app-main">
            <Routes>
              {/* Redirige "/" al feed automáticamente */}
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/emotions" element={<EmotionsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/create-post" element={<CreatePostPage />} />
            </Routes>
          </main>
 
          {/* Navbar inferior: solo se muestra en móvil (CSS lo controla) */}
          <Navbar />
 
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};
 
export default App;