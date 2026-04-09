import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiUpload, FiExternalLink, FiGithub } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

const emptyProject = {
  title: '', description: '', image: '', category: 'Full Stack',
  tags: '', github: '', demo: '', featured: false, imageFile: null,
};

function ProjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial ? {
    ...initial,
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags || '',
    imageFile: null,
  } : emptyProject);
  const [preview, setPreview] = useState(initial?.image || '');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title || !form.description) { toast.error('Title and description required'); return; }
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)', borderRadius: 20, padding: '32px',
          width: '100%', maxWidth: 600, border: '1px solid var(--border)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
            {initial ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>
            <FiX />
          </button>
        </div>

        {/* Image upload area */}
        <div
          onClick={() => fileRef.current.click()}
          style={{
            height: 160, borderRadius: 12, marginBottom: 20,
            border: '2px dashed var(--border)', overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
            background: preview ? 'transparent' : 'var(--gradient-soft)',
            transition: 'border-color 0.2s',
          }}
        >
          {preview ? (
            <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <FiUpload style={{ fontSize: '2rem', marginBottom: 8 }} />
              <p style={{ fontSize: '0.85rem' }}>Click to upload project image</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Or paste image URL</label>
          <input
            className="form-input"
            placeholder="https://images.unsplash.com/..."
            value={form.image}
            onChange={e => { setForm({ ...form, image: e.target.value, imageFile: null }); setPreview(e.target.value); }}
          />
        </div>

        {[
          { label: 'Title *', key: 'title', placeholder: 'Project title' },
          { label: 'Description *', key: 'description', placeholder: 'Short description', textarea: true },
          { label: 'GitHub URL', key: 'github', placeholder: 'https://github.com/...' },
          { label: 'Live Demo URL', key: 'demo', placeholder: 'https://...' },
          { label: 'Tags (comma separated)', key: 'tags', placeholder: 'React, Node.js, MongoDB' },
        ].map(field => (
          <div className="form-group" key={field.key}>
            <label className="form-label">{field.label}</label>
            {field.textarea ? (
              <textarea className="form-input" placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} rows={3} />
            ) : (
              <input className="form-input" placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} />
            )}
          </div>
        ))}

        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {['Frontend', 'Backend', 'Full Stack', 'Mobile', 'Other'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
          <label htmlFor="featured" style={{ fontWeight: 500, fontSize: '0.9rem' }}>Mark as Featured</label>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={saving}
            className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', opacity: saving ? 0.7 : 1 }}
          >
            <FiSave /> {saving ? 'Saving...' : 'Save Project'}
          </motion.button>
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminProjects() {
  const { data, addProject, updateProject, deleteProject } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const handleSave = async (form) => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        tags: form.tags,
        github: form.github,
        demo: form.demo,
        featured: form.featured,
        image: form.image,
        imageFile: form.imageFile,
      };
      if (editProject) {
        await updateProject(editProject.id, payload);
        toast.success('Project updated!');
      } else {
        await addProject(payload);
        toast.success('Project added!');
      }
      setShowForm(false);
      setEditProject(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.8rem', fontWeight: 800 }}>Manage Projects</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Add, edit, or remove your portfolio projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setEditProject(null); setShowForm(true); }}
          className="btn btn-primary"
        >
          <FiPlus /> Add Project
        </motion.button>
      </div>

      {data.projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📁</div>
          <p style={{ color: 'var(--text-secondary)' }}>No projects yet. Add your first one!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {data.projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}
          >
            <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
              {project.image ? (
                <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--gradient-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>📁</div>
              )}
              {project.featured && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'var(--gradient)', color: 'white', padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 700 }}>⭐ Featured</div>
              )}
              <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 10px', borderRadius: 50, fontSize: '0.72rem', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                {project.category}
              </div>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: 6 }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.5, marginBottom: 10 }}>
                {project.description?.length > 80 ? project.description.slice(0, 80) + '...' : project.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                {(Array.isArray(project.tags) ? project.tags : []).slice(0, 3).map(tag => (
                  <span key={tag} className="tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {project.demo && <a href={project.demo} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 3 }}><FiExternalLink /> Demo</a>}
                {project.github && <a href={project.github} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 3 }}><FiGithub /> GitHub</a>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setEditProject(project); setShowForm(true); }}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem' }}
                >
                  <FiEdit2 /> Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(project.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: '#ef4444', cursor: 'pointer', fontWeight: 600, fontSize: '0.83rem' }}
                >
                  <FiTrash2 /> Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <ProjectForm
            initial={editProject}
            onSave={handleSave}
            onClose={() => { setShowForm(false); setEditProject(null); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
