import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const navLinks = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

export default function Navbar() {
  const { darkMode, setDarkMode } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navLinks.map(l => document.getElementById(l.toLowerCase()));
      const scrollPos = window.scrollY + 100;
      sections.forEach((sec, i) => {
        if (sec && scrollPos >= sec.offsetTop) setActive(navLinks[i]);
      });
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'var(--bg-nav)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : 'none',
        boxShadow: scrolled ? 'var(--shadow)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollTo('home')}
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.4rem', cursor: 'pointer' }}
          className="gradient-text"
        >
          Portfolio
        </motion.div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <motion.button
              key={link}
              onClick={() => scrollTo(link)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '8px 18px',
                borderRadius: 50,
                border: 'none',
                background: active === link ? 'var(--gradient)' : 'transparent',
                color: active === link ? 'white' : 'var(--text)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {link}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDarkMode(!darkMode)}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '2px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem',
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </motion.button>

          {/* Mobile menu toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
            style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '2px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              display: 'none', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.2rem',
            }}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'var(--bg-card)',
              borderTop: '1px solid var(--border)',
              padding: '16px 24px',
            }}
          >
            {navLinks.map(link => (
              <motion.button
                key={link}
                onClick={() => scrollTo(link)}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 16px', borderRadius: 8, border: 'none',
                  background: active === link ? 'var(--gradient-soft)' : 'transparent',
                  color: active === link ? 'var(--primary)' : 'var(--text)',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
                  marginBottom: 4,
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  );
}
