import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Profile from './pages/profile/Profile';
import EditProfilePage from './pages/profile/EditProfile';
import './components/navigation.css';
 
/* páginas temporales mientras se construyen las reales
   solo muestran un texto para que la ruta no quede vacía */
const FeedPage = () => (
  <div style={{ padding: '32px' }}>
    <h2 style={{ color: '#2d2d2d' }}>Feed</h2>
    <p style={{ color: '#8a8a8a' }}>Aquí irán los posts del feed.</p>
  </div>
);
 
const EmotionsPage = () => (
  <div style={{ padding: '32px' }}>
    <h2 style={{ color: '#2d2d2d' }}>Emotion History</h2>
    <p style={{ color: '#8a8a8a' }}>Aquí irá el historial de emociones.</p>
  </div>
);
 
const App: React.FC = () => (
  // AppProvider envuelve todo para que cualquier componente pueda acceder al estado global
  <AppProvider>
    {/* BrowserRouter habilita la navegación entre páginas sin recargar */}
    <BrowserRouter>
      <div className="app-layout">
 
        {/* sidebar de escritorio — siempre visible en pantallas grandes */}
        <Sidebar />
 
        <main className="app-main">
          <Routes>
            {/* si entras a "/" te manda directo al feed */}
            <Route path="/"             element={<Navigate to="/feed" replace />} />
 
            {/* rutas principales */}
            <Route path="/feed"         element={<FeedPage />} />
            <Route path="/emotions"     element={<EmotionsPage />} />
            <Route path="/profile"      element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
 
            {/* cualquier ruta que no exista también manda al feed */}
            <Route path="*"             element={<Navigate to="/feed" replace />} />
          </Routes>
        </main>
 
        {/* navbar de móvil — barra de abajo */}
        <Navbar />
 
      </div>
    </BrowserRouter>
  </AppProvider>
);
 
export default App;