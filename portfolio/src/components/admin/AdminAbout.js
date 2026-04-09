import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUpload, FiUser, FiMail, FiPhone, FiMapPin, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

export default function AdminAbout() {
  const { data, updateProfile, uploadProfileImage, uploadCV, removeProfileImage } = useApp();
  const [form, setForm] = useState({ ...data.profile });
  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const imgRef = useRef();
  const cvRef = useRef();

  // Keep form in sync if profile loads after mount
  React.useEffect(() => { setForm({ ...data.profile }); }, [data.profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const allowed = ['name','title','bio','about','email','phone','location','github','linkedin','twitter'];
      const updates = {};
      allowed.forEach(k => { if (form[k] !== undefined) updates[k] = form[k]; });
      await updateProfile(updates);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setUploadingImg(true);
    try {
      await uploadProfileImage(file);
      toast.success('Profile photo updated!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImg(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCV(true);
    try {
      await uploadCV(file);
      toast.success('CV uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await removeProfileImage();
      toast.success('Photo removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove');
    }
  };

  const fields = [
    { label: 'Full Name', key: 'name', icon: <FiUser />, placeholder: 'John Doe' },
    { label: 'Professional Title', key: 'title', icon: <FiUser />, placeholder: 'Full Stack Developer' },
    { label: 'Email', key: 'email', icon: <FiMail />, placeholder: 'john@example.com' },
    { label: 'Phone', key: 'phone', icon: <FiPhone />, placeholder: '+1 (555) 123-4567' },
    { label: 'Location', key: 'location', icon: <FiMapPin />, placeholder: 'New York, USA' },
    { label: 'GitHub URL', key: 'github', icon: <FiGithub />, placeholder: 'https://github.com/...' },
    { label: 'LinkedIn URL', key: 'linkedin', icon: <FiLinkedin />, placeholder: 'https://linkedin.com/in/...' },
    { label: 'Twitter URL', key: 'twitter', icon: <FiTwitter />, placeholder: 'https://twitter.com/...' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>Manage About</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Update your profile information and bio</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28, alignItems: 'start' }} className="about-admin-grid">
        {/* Profile image & CV */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{
            background: 'var(--bg-card)', borderRadius: 16,
            padding: '24px', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)', textAlign: 'center',
          }}>
            <div style={{
              width: 120, height: 120, borderRadius: '50%',
              margin: '0 auto 16px',
              overflow: 'hidden',
              border: '3px solid var(--primary)',
              background: 'var(--gradient-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {data.profile.profileImage ? (
                <img src={data.profile.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Poppins', background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {form.name?.charAt(0) || 'P'}
                </span>
              )}
            </div>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>{form.name}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 16 }}>{form.title}</p>
            <input ref={imgRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => imgRef.current.click()}
              disabled={uploadingImg}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', opacity: uploadingImg ? 0.7 : 1 }}
            >
              <FiUpload /> {uploadingImg ? 'Uploading...' : 'Upload Photo'}
            </motion.button>
            {data.profile.profileImage && (
              <button
                onClick={handleRemoveImage}
                style={{
                  marginTop: 8, width: '100%', padding: '8px',
                  background: 'none', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8, color: '#ef4444', cursor: 'pointer',
                  fontSize: '0.83rem', fontWeight: 600,
                }}
              >
                Remove Photo
              </button>
            )}
          </div>

          {/* CV Upload */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: 16,
            padding: '20px', border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-card)',
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}>Resume / CV</h3>
            <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCVUpload} style={{ display: 'none' }} />
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => cvRef.current.click()}
              disabled={uploadingCV}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', opacity: uploadingCV ? 0.7 : 1 }}
            >
              <FiUpload /> {uploadingCV ? 'Uploading...' : data.profile.cvFile ? 'Replace CV' : 'Upload CV'}
            </motion.button>
            {data.profile.cvFile && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.82rem', color: '#10b981', fontWeight: 600 }}>
                ✓ CV uploaded — available for download
              </div>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '28px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {fields.map(field => (
              <div className="form-group" key={field.key} style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--primary)' }}>{field.icon}</span> {field.label}
                </label>
                <input
                  className="form-input"
                  placeholder={field.placeholder}
                  value={form[field.key] || ''}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">Short Bio (Hero section)</label>
            <textarea
              className="form-input"
              placeholder="Short bio shown in hero section..."
              value={form.bio || ''}
              onChange={e => setForm({ ...form, bio: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full About Text</label>
            <textarea
              className="form-input"
              placeholder="Detailed about me text (use double newline for paragraphs)..."
              value={form.about || ''}
              onChange={e => setForm({ ...form, about: e.target.value })}
              rows={6}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ marginTop: 8, opacity: saving ? 0.7 : 1 }}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
