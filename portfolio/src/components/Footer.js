import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiMail, FiHeart } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { data } = useApp();
  const { profile } = data;

  const socials = [
    { icon: <FaGithub />, url: profile.github },
    { icon: <FaLinkedin />, url: profile.linkedin },
    { icon: <FaTwitter />, url: profile.twitter },
    { icon: <FiMail />, url: `mailto:${profile.email}` },
  ];

  return (
    <footer style={{
      background: 'var(--bg-card)',
      borderTop: '1px solid var(--border)',
      padding: '40px 0',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div>
            <div style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800, fontSize: '1.3rem',
              marginBottom: 6,
            }} className="gradient-text">
              Portfolio
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Building digital experiences with passion
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {socials.map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-secondary)', fontSize: '1rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {s.icon}
              </motion.a>
            ))}
          </div>

          <p style={{
            color: 'var(--text-muted)', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            © {new Date().getFullYear()} {profile.name}. Made with <FiHeart style={{ color: '#ec4899' }} /> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
