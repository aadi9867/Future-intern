import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InternshipPage from './pages/InternshipPage';
import CertificatesPage from './pages/CertificatesPage';
import OfferLetterPage from './pages/OfferLetterPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import ProfilePage from './pages/ProfilePage';
import { Trophy } from 'lucide-react';
import CertificateDetailPage from './pages/CertificateDetailPage';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/internships" element={user ? <InternshipPage /> : <Navigate to="/login" />} />
          <Route path="/internships/:internshipId" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/certificates" element={user ? <CertificatesPage /> : <Navigate to="/login" />} />
          <Route path="/certificates/:certificateNumber" element={user ? <CertificateDetailPage /> : <Navigate to="/login" />} />
          <Route path="/offer-letter" element={user ? <OfferLetterPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 