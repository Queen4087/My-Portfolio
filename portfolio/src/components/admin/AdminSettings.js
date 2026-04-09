import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';

export default function AdminSettings() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);

  const handleChange = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error('All fields are required'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match'); return;
    }
    if (form.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters'); return;
    }
    setSaving(true);
    try {
      const res = await authAPI.changePassword(form.currentPassword, form.newPassword);
      if (res.success) {
        toast.success('Password changed successfully!');
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const PasswordField = ({ label, field, showKey }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className="form-input"
          type={show[showKey] ? 'text' : 'password'}
          placeholder="••••••••"
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          style={{ paddingRight: 48 }}
        />
        <button
          type="button"
          onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }}
        >
          {show[showKey] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Manage your admin account security</p>
      </div>

      <div style={{ maxWidth: 480 }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.1rem' }}>
              <FiLock />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1rem' }}>Change Password</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Update your admin password</p>
            </div>
          </div>

          <form onSubmit={handleChange}>
            <PasswordField label="Current Password" field="currentPassword" showKey="current" />
            <PasswordField label="New Password" field="newPassword" showKey="new" />
            <PasswordField label="Confirm New Password" field="confirmPassword" showKey="confirm" />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={saving}
              className="btn btn-primary"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              <FiSave /> {saving ? 'Saving...' : 'Change Password'}
            </motion.button>
          </form>
        </div>

        <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(245,158,11,0.08)', borderRadius: 12, border: '1px solid rgba(245,158,11,0.2)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: '#f59e0b' }}>Security tip:</strong> Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
