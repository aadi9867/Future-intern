import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../Logo.png';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-b-3xl border-b-4 border-gradient-to-r from-logo-blue via-logo-cyan to-logo-green">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Future Intern Logo" className="h-12 w-12 rounded-2xl shadow-lg border-2 border-logo-blue" />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green bg-clip-text text-transparent tracking-tight drop-shadow">Future Intern</span>
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className={`font-semibold px-4 py-2 rounded-xl transition-colors duration-200 ${location.pathname.startsWith('/dashboard') ? 'bg-logo-blue text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-blue/10 hover:text-logo-blue'}`}>Dashboard</Link>
          <Link to="/internships" className={`font-semibold px-4 py-2 rounded-xl transition-colors duration-200 ${location.pathname.startsWith('/internships') ? 'bg-logo-cyan text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-cyan/10 hover:text-logo-cyan'}`}>Internships</Link>
          <Link to="/certificates" className={`font-semibold px-4 py-2 rounded-xl transition-colors duration-200 ${location.pathname.startsWith('/certificates') ? 'bg-logo-green text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-green/10 hover:text-logo-green'}`}>Certificates</Link>
          <Link to="/offer-letter" className={`font-semibold px-4 py-2 rounded-xl transition-colors duration-200 ${location.pathname.startsWith('/offer-letter') ? 'bg-gradient-to-r from-logo-blue to-logo-green text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-blue/10 hover:text-logo-blue'}`}>Offer Letter</Link>
        </div>
        {/* User/Profile/Login */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700 dark:text-gray-200 font-medium">{user?.name?.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-logo-blue to-logo-green text-white font-semibold shadow-lg hover:from-logo-green hover:to-logo-blue transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-5 py-2 rounded-xl bg-gradient-to-r from-logo-blue to-logo-green text-white font-semibold shadow-lg hover:from-logo-green hover:to-logo-blue transition">Login</Link>
          )}
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden flex items-center px-3 py-2 rounded-lg text-logo-blue focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white/95 dark:bg-gray-900/95 shadow-2xl rounded-b-3xl flex flex-col items-center gap-4 py-6 z-50 animate-fade-in">
            <Link to="/dashboard" className={`font-semibold px-4 py-2 rounded-xl w-3/4 text-center transition-colors duration-200 ${location.pathname.startsWith('/dashboard') ? 'bg-logo-blue text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-blue/10 hover:text-logo-blue'}`} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/internships" className={`font-semibold px-4 py-2 rounded-xl w-3/4 text-center transition-colors duration-200 ${location.pathname.startsWith('/internships') ? 'bg-logo-cyan text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-cyan/10 hover:text-logo-cyan'}`} onClick={() => setMenuOpen(false)}>Internships</Link>
            <Link to="/certificates" className={`font-semibold px-4 py-2 rounded-xl w-3/4 text-center transition-colors duration-200 ${location.pathname.startsWith('/certificates') ? 'bg-logo-green text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-green/10 hover:text-logo-green'}`} onClick={() => setMenuOpen(false)}>Certificates</Link>
            <Link to="/offer-letter" className={`font-semibold px-4 py-2 rounded-xl w-3/4 text-center transition-colors duration-200 ${location.pathname.startsWith('/offer-letter') ? 'bg-gradient-to-r from-logo-blue to-logo-green text-white shadow-lg' : 'text-gray-700 dark:text-gray-200 hover:bg-logo-blue/10 hover:text-logo-blue'}`} onClick={() => setMenuOpen(false)}>Offer Letter</Link>
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-logo-blue to-logo-green text-white font-semibold shadow-lg hover:from-logo-green hover:to-logo-blue transition w-3/4 mt-2"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="px-5 py-2 rounded-xl bg-gradient-to-r from-logo-blue to-logo-green text-white font-semibold shadow-lg hover:from-logo-green hover:to-logo-blue transition w-3/4 mt-2" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
} 