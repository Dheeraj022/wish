import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeartAnimation from './components/HeartAnimation';
import MusicPlayer from './components/MusicPlayer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import PublicLovePage from './pages/PublicLovePage';

function App() {
  return (
    <>
      <HeartAnimation />
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} /> {/* Reusing Login for now */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/love/:slug" element={<PublicLovePage />} />
      </Routes>
    </>
  );
}

export default App;
