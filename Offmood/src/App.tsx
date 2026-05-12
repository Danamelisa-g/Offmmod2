import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './components/navigation.css';
import SignUpPage from './pages/Signup/SignUpPage';

// Placeholder temporal mientras se crean las páginas 
const FeedPage = () => <h1 style={{ padding: '24px' }}>Feed</h1>;
const EmotionsPage = () => <h1 style={{ padding: '24px' }}>Emotion History</h1>;
const ProfilePage = () => <h1 style={{ padding: '24px' }}>Profile</h1>;
const CreatePostPage = () => <h1 style={{ padding: '24px' }}>Create Post</h1>;

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed"        element={<FeedPage />} />
              <Route path="/emotions"    element={<EmotionsPage />} />
              <Route path="/profile"     element={<ProfilePage />} />
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/signup"      element={<SignUpPage />} />
            </Routes>
          </main>
          <Navbar />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;