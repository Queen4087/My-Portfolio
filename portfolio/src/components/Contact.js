import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';

export default function Contact() {
  const { data, sendMessage } = useApp();
  const { profile } = data;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setSending(true);
    try {
      const res = await sendMessage(form);
      if (res.success) {
        toast.success('Message sent! I\'ll get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send message. Try again.');
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: <FiMail />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: <FiPhone />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
    { icon: <FiMapPin />, label: 'Location', value: profile.location, href: '#' },
  ];

  const socials = [
    { icon: <FaGithub />, url: profile.github, label: 'GitHub' },
    { icon: <FaLinkedin />, url: profile.linkedin, label: 'LinkedIn' },
    { icon: <FaTwitter />, url: profile.twitter, label: 'Twitter' },
    { icon: <FiMail />, url: `mailto:${profile.email}`, label: 'Email' },
  ];

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-line" />
          <p className="section-subtitle">Have a project in mind? Let's work together</p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',
          gap: 48,
          alignItems: 'start',
        }} className="contact-grid">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.5rem', fontWeight: 700,
              marginBottom: 16,
            }}>
              Let's talk about your project
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32 }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {contactInfo.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px',
                    background: 'var(--bg-card)',
                    borderRadius: 14,
                    border: '1px solid var(--border)',
                    textDecoration: 'none',
                    color: 'var(--text)',
                    boxShadow: 'var(--shadow-card)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'var(--gradient-soft)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--primary)', fontSize: '1.1rem',
                    border: '1px solid rgba(108,99,255,0.2)',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            <div>
              <p style={{ fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Follow me on</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {socials.map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    title={s.label}
                    style={{
                      width: 44, height: 44, borderRadius: '50%',
                      border: '2px solid var(--border)',
                      background: 'var(--bg-card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-secondary)', fontSize: '1.1rem',
                      textDecoration: 'none',
                      boxShadow: 'var(--shadow-card)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 24,
              padding: '36px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: 24 }}>
              Send a Message
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  className="form-input"
                  placeholder="Gifti Hussein"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="example@.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input"
                  placeholder="Tell me about your project..."
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <motion.button
                type="submit"
                className="btn btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={sending}
                style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.7 : 1 }}
              >
                {sending ? 'Sending...' : <><FiSend /> Send Message</>}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
