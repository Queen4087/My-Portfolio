import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

const categoryColors = {
  Frontend: '#6c63ff', Backend: '#ec4899',
  Database: '#f59e0b', DevOps: '#10b981', Other: '#64748b',
};

const emptySkill = { name: '', level: 80, category: 'Frontend', icon: 'FaReact' };

function SkillForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptySkill);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name) { toast.error('Skill name required'); return; }
    setSaving(true);
    try { await onSave(form); }
    finally { setSaving(false); }
  };

  const color = categoryColors[form.category] || '#6c63ff';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 460, border: '1px solid var(--border)', boxShadow: '0 25px 80px rgba(0,0,0,0.25)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
            {initial ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}><FiX /></button>
        </div>

        <div className="form-group">
          <label className="form-label">Skill Name *</label>
          <input className="form-input" placeholder="e.g. React" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {['Frontend', 'Backend', 'Database', 'DevOps', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Proficiency Level: <strong style={{ color }}>{form.level}%</strong>
          </label>
          <input
            type="range" min={10} max={100} step={5}
            value={form.level}
            onChange={e => setForm({ ...form, level: Number(e.target.value) })}
            style={{ width: '100%', accentColor: color, marginTop: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            <span>Beginner</span><span>Intermediate</span><span>Expert</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Icon Key (react-icons)</label>
          <input className="form-input" placeholder="e.g. FaReact, SiTypescript" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Use icon names from <a href="https://react-icons.github.io/react-icons" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>react-icons.github.io</a>
          </p>
        </div>

        {/* Live preview */}
        <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--gradient-soft)', border: '1px solid rgba(108,99,255,0.2)', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{form.name || 'Skill Name'}</span>
            <span style={{ fontWeight: 700, color }}>{form.level}%</span>
          </div>
          <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${form.level}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 3, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={saving}
            className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Skill'}
          </motion.button>
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminSkills() {
  const { data, addSkill, updateSkill, deleteSkill } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editSkill, setEditSkill] = useState(null);

  const categories = [...new Set(data.skills.map(s => s.category))];

  const handleSave = async (skill) => {
    try {
      if (editSkill) {
        await updateSkill(editSkill.id, skill);
        toast.success('Skill updated!');
      } else {
        await addSkill(skill);
        toast.success('Skill added!');
      }
      setShowForm(false);
      setEditSkill(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save skill');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await deleteSkill(id);
      toast.success('Skill deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>Manage Skills</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Add, edit, or remove skills and set proficiency levels</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setEditSkill(null); setShowForm(true); }}
          className="btn btn-primary"
        >
          <FiPlus /> Add Skill
        </motion.button>
      </div>

      {data.skills.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚡</div>
          <p style={{ color: 'var(--text-secondary)' }}>No skills yet. Add your first one!</p>
        </div>
      )}

      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: categoryColors[cat] || 'var(--primary)', fontSize: '1rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: categoryColors[cat] || 'var(--primary)', display: 'inline-block' }} />
            {cat}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {data.skills.filter(s => s.category === cat).map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ background: 'var(--bg-card)', borderRadius: 14, padding: '16px 18px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{skill.name}</span>
                  <span style={{ fontWeight: 800, color: categoryColors[cat] || 'var(--primary)', fontSize: '0.9rem' }}>{skill.level}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden', marginBottom: 14 }}>
                  <div style={{ height: '100%', width: `${skill.level}%`, background: `linear-gradient(90deg, ${categoryColors[cat] || '#6c63ff'}, ${categoryColors[cat] || '#6c63ff'}aa)`, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setEditSkill(skill); setShowForm(true); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    <FiEdit2 /> Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(skill.id)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    <FiTrash2 /> Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <AnimatePresence>
        {showForm && (
          <SkillForm
            initial={editSkill}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditSkill(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
