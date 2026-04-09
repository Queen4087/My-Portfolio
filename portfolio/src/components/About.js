import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiDownload, FiUser, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function About() {
  const { data } = useApp();
  const { profile } = data;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { label: 'Years Experience', value: '5+' },
    { label: 'Projects Completed', value: '50+' },
    { label: 'Happy Clients', value: '30+' },
    { label: 'Technologies', value: '20+' },
  ];

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">About Me</h2>
          <div className="section-line" />
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: 60,
          alignItems: 'center',
          marginTop: 20,
        }} className="about-grid">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div style={{
              borderRadius: 24,
              overflow: 'hidden',
              aspectRatio: '4/5',
              background: 'var(--gradient-soft)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
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
                  flexDirection: 'column', gap: 16,
                }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'var(--gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '3rem', color: 'white', fontWeight: 800,
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                    {profile.name.charAt(0)}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Profile Photo</p>
                </div>
              )}
            </div>

            {/* Stats overlay */}
            <div style={{
              position: 'absolute', bottom: -20, right: -20,
              background: 'var(--bg-card)',
              borderRadius: 16, padding: '16px 20px',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '1.4rem', fontWeight: 800,
                      fontFamily: 'Poppins, sans-serif',
                      background: 'var(--gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
              fontWeight: 700,
              lineHeight: 1.4,
              marginBottom: 20,
            }}>
              I'm a passionate developer dedicated to creating exceptional digital experiences
            </h3>

            {profile.about.split('\n\n').map((para, i) => (
              <p key={i} style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: 16,
                fontSize: '0.98rem',
              }}>
                {para}
              </p>
            ))}

            {/* Info grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 12, margin: '24px 0',
            }}>
              {[
                { icon: <FiUser />, label: 'Name', value: profile.name },
                { icon: <FiMail />, label: 'Email', value: profile.email },
                { icon: <FiPhone />, label: 'Phone', value: profile.phone },
                { icon: <FiMapPin />, label: 'Location', value: profile.location },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px',
                  background: 'var(--gradient-soft)',
                  borderRadius: 10,
                  border: '1px solid rgba(108,99,255,0.15)',
                }}>
                  <span style={{ color: 'var(--primary)', fontSize: '1rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {profile.cvFile ? (
              <a href={profile.cvFile} download className="btn btn-primary">
                <FiDownload /> Download CV
              </a>
            ) : (
              <button className="btn btn-primary" style={{ opacity: 0.7 }}>
                <FiDownload /> Download CV
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
        }
      `}</style>
    </section>
  );
}
