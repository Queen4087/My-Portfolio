import React from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiCode, FiMail, FiMessageSquare } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

export default function AdminOverview() {
  const { data } = useApp();
  const unread = data.messages.filter(m => !m.read).length;

  const stats = [
    { label: 'Total Projects', value: data.projects.length, icon: <FiFolder />, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)' },
    { label: 'Skills', value: data.skills.length, icon: <FiCode />, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
    { label: 'Messages', value: data.messages.length, icon: <FiMail />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Unread Messages', value: unread, icon: <FiMessageSquare />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>
        Dashboard Overview
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 36 }}>Welcome back! Here's what's happening.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: 'var(--shadow-hover)' }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 16, padding: '24px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: s.bg, color: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', marginBottom: 16,
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Poppins, sans-serif', color: s.color }}>
              {s.value}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500, marginTop: 4 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent messages */}
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>Recent Messages</h2>
          {unread > 0 && (
            <span style={{
              background: 'var(--gradient)', color: 'white',
              borderRadius: 50, padding: '2px 10px',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {unread} unread
            </span>
          )}
        </div>
        {data.messages.slice(0, 4).map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              padding: '16px 24px',
              borderBottom: i < Math.min(data.messages.length, 4) - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 16,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.9rem',
              flexShrink: 0,
            }}>
              {msg.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{msg.name}</span>
                {!msg.read && (
                  <span style={{
                    background: 'var(--gradient)', color: 'white',
                    borderRadius: 50, padding: '1px 8px',
                    fontSize: '0.68rem', fontWeight: 700,
                  }}>New</span>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {msg.message}
              </p>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', flexShrink: 0 }}>{msg.date}</span>
          </motion.div>
        ))}
        {data.messages.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No messages yet</div>
        )}
      </div>
    </motion.div>
  );
}
