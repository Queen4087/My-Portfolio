import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEye, FiTrash2, FiX, FiMail, FiCheckSquare, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

function MessageModal({ msg, onClose, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 520, border: '1px solid var(--border)', boxShadow: '0 25px 80px rgba(0,0,0,0.25)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
              {msg.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>{msg.name}</h3>
              <a href={`mailto:${msg.email}`} style={{ color: 'var(--primary)', fontSize: '0.88rem', textDecoration: 'none' }}>{msg.email}</a>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}><FiX /></button>
        </div>

        <div style={{ padding: '20px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 20 }}>
          <p style={{ lineHeight: 1.8, color: 'var(--text)' }}>{msg.message}</p>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 20 }}>
          Received: {new Date(msg.createdAt || msg.date).toLocaleString()}
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <a href={`mailto:${msg.email}?subject=Re: Your message`} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            <FiMail /> Reply via Email
          </a>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { onDelete(msg.id); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 50, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
          >
            <FiTrash2 /> Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminMessages() {
  const { data, deleteMessage, markMessageRead, markAllRead, loadMessages, unreadCount } = useApp();
  const [selected, setSelected] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleView = async (msg) => {
    if (!msg.read) await markMessageRead(msg.id);
    setSelected(msg);
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      toast.success('All messages marked as read');
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMessages();
      toast.success('Messages refreshed');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>Messages</h1>
            {unreadCount > 0 && (
              <span style={{ background: 'var(--gradient)', color: 'white', borderRadius: 50, padding: '3px 12px', fontSize: '0.82rem', fontWeight: 700 }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>View and manage messages from your contact form</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleMarkAllRead}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              <FiCheckSquare /> Mark all read
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
          >
            <FiRefreshCw style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} /> Refresh
          </motion.button>
        </div>
      </div>

      {data.messages.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <p style={{ color: 'var(--text-secondary)' }}>No messages yet</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--bg-card)', borderRadius: 14,
              padding: '18px 22px', border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-card)',
              borderLeft: !msg.read ? '3px solid var(--primary)' : '3px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                {msg.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 700 }}>{msg.name}</span>
                  {!msg.read && (
                    <span style={{ background: 'var(--gradient)', color: 'white', borderRadius: 50, padding: '1px 8px', fontSize: '0.68rem', fontWeight: 700 }}>New</span>
                  )}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 5 }}>{msg.email}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {msg.message}
                </p>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.76rem', marginTop: 5 }}>
                  {new Date(msg.createdAt || msg.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleView(msg)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  <FiEye /> View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(msg.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  <FiTrash2 /> Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <MessageModal msg={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />}
      </AnimatePresence>
    </motion.div>
  );
}
