import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiArrowRight, FiMail, FiDownload } from 'react-icons/fi';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function Hero() {
  const { data } = useApp();
  const { profile } = data;

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 80,
      }}
    >
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '5%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ width: '100%' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}
          className="hero-grid"
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 18px', borderRadius: 50,
                background: 'var(--gradient-soft)',
                border: '1px solid rgba(108,99,255,0.2)',
                color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem',
                marginBottom: 24,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'glow 2s infinite' }} />
              Welcome to my portfolio
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: 12,
              }}
            >
              Hi, I'm{' '}
              <span className="gradient-text">{profile.name}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)',
                fontWeight: 700,
                color: 'var(--primary)',
                marginBottom: 20,
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <TypeAnimation
                sequence={[
                  profile.title,
                  2000,
                  'UI/UX Designer',
                  2000,
                  'Problem Solver',
                  2000,
                  'Open Source Contributor',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}
            >
              <button className="btn btn-primary" onClick={() => scrollTo('projects')}>
                View Projects <FiArrowRight />
              </button>
              <button className="btn btn-outline" onClick={() => scrollTo('contact')}>
                Contact Me <FiMail />
              </button>
              {profile.cvFile && (
                <a href={profile.cvFile} download className="btn btn-outline">
                  <FiDownload /> Download CV
                </a>
              )}
              {!profile.cvFile && (
                <button className="btn btn-outline" style={{ opacity: 0.6 }}>
                  <FiDownload /> Download CV
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ display: 'flex', gap: 16 }}
            >
              {[
                { icon: <FaGithub />, url: profile.github },
                { icon: <FaLinkedin />, url: profile.linkedin },
                { icon: <FiMail />, url: `mailto:${profile.email}` },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '2px solid var(--border)',
                    background: 'var(--bg-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', fontSize: '1.1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {s.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right - Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              {/* Glow ring */}
              <div style={{
                position: 'absolute', inset: -8,
                borderRadius: '50%',
                background: 'var(--gradient)',
                opacity: 0.3,
                filter: 'blur(20px)',
                animation: 'glow 3s ease-in-out infinite',
              }} />
              <div style={{
                width: 'clamp(260px, 35vw, 380px)',
                height: 'clamp(260px, 35vw, 380px)',
                borderRadius: '50%',
                border: '4px solid transparent',
                background: 'var(--gradient) border-box',
                padding: 4,
                position: 'relative',
                animation: 'float 6s ease-in-out infinite',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'var(--gradient-soft)',
                }}>
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 'clamp(4rem, 8vw, 7rem)',
                      fontWeight: 800, fontFamily: 'Poppins, sans-serif',
                      background: 'var(--gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                style={{
                  position: 'absolute', top: '10%', right: '-15%',
                  background: 'var(--bg-card)',
                  borderRadius: 12, padding: '10px 16px',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>⚡</span> 5+ Years Exp
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                style={{
                  position: 'absolute', bottom: '15%', left: '-15%',
                  background: 'var(--bg-card)',
                  borderRadius: 12, padding: '10px 16px',
                  boxShadow: 'var(--shadow)',
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🚀</span> 50+ Projects
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 40px !important;
          }
          .hero-grid > div:first-child > div[style*="display: flex"] {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}
