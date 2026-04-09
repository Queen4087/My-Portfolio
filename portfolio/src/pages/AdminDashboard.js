import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid, FiFolder, FiCode, FiUser, FiMail,
  FiLogOut, FiMoon, FiSun, FiExternalLink, FiSettings,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProjects from '../components/admin/AdminProjects';
import AdminSkills from '../components/admin/AdminSkills';
import AdminAbout from '../components/admin/AdminAbout';
import AdminMessages from '../components/admin/AdminMessages';
import AdminSettings from '../components/admin/AdminSettings';

const navItems = [
  { path: '', label: 'Overview', icon: <FiGrid /> },
  { path: 'projects', label: 'Projects', icon: <FiFolder /> },
  { path: 'skills', label: 'Skills', icon: <FiCode /> },
  { path: 'about', label: 'About', icon: <FiUser /> },
  { path: 'messages', label: 'Messages', icon: <FiMail />, badge: true },
  { path: 'settings', label: 'Settings', icon: <FiSettings /> },
];

export default function AdminDashboard() {
  const { logout, darkMode, setDarkMode, unreadCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const currentPath = location.pathname.replace('/admin/', '').replace('/admin', '');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        style={{
          width: 240, background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: 0,
          zIndex: 100, boxShadow: 'var(--shadow)',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '22px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.95rem' }}>
              <FiGrid />
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1rem' }} className="gradient-text">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const isActive = currentPath === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(`/admin${item.path ? '/' + item.path : ''}`)}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  width: '100%', padding: '11px 14px',
                  borderRadius: 10, border: 'none',
                  background: isActive ? 'var(--gradient)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600, fontSize: '0.88rem',
                  cursor: 'pointer', marginBottom: 3,
                  textAlign: 'left', transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && unreadCount > 0 && (
                  <span style={{
                    background: isActive ? 'rgba(255,255,255,0.3)' : 'var(--gradient)',
                    color: 'white', borderRadius: 50, padding: '1px 7px',
                    fontSize: '0.7rem', fontWeight: 700,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ x: 3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', marginBottom: 3 }}
          >
            <FiExternalLink /> View Portfolio
          </motion.button>
          <motion.button
            onClick={handleLogout}
            whileHover={{ x: 3 }}
            style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#ef4444', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <FiLogOut /> Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main */}
      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--bg-nav)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '13px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10,
        }}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem' }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <FiLogOut /> Logout
          </motion.button>
        </header>

        <main style={{ flex: 1, padding: '32px', overflowX: 'hidden' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/projects" element={<AdminProjects />} />
              <Route path="/skills" element={<AdminSkills />} />
              <Route path="/about" element={<AdminAbout />} />
              <Route path="/messages" element={<AdminMessages />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          aside { width: 200px !important; }
          div[style*="margin-left: 240px"] { margin-left: 200px !important; }
          main { padding: 20px !important; }
        }
        @media (max-width: 600px) {
          aside { transform: translateX(-100%); }
          div[style*="margin-left: 240px"] { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
