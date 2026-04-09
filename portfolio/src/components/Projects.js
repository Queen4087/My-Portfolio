import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 24,
          maxWidth: 700,
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={project.image}
            alt={project.title}
            style={{ width: '100%', height: 280, objectFit: 'cover' }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: 'none',
              color: 'white', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <FiX />
          </button>
          {project.featured && (
            <div style={{
              position: 'absolute', top: 16, left: 16,
              background: 'var(--gradient)', color: 'white',
              padding: '4px 12px', borderRadius: 50,
              fontSize: '0.78rem', fontWeight: 700,
            }}>
              ⭐ Featured
            </div>
          )}
        </div>
        <div style={{ padding: '28px 32px' }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>
            {project.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-primary">
              <FiExternalLink /> Live Demo
            </a>
            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-outline">
              <FiGithub /> GitHub
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: hovered ? 'var(--shadow-hover)' : 'var(--shadow-card)',
          transition: 'box-shadow 0.3s ease',
          cursor: 'pointer',
        }}
        onClick={() => setModalOpen(true)}
      >
        <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(108,99,255,0.9) 0%, rgba(108,99,255,0.4) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: hovered ? 1 : 0 }}
              transition={{ delay: 0.05 }}
              style={{
                background: 'white', borderRadius: '50%',
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontSize: '1.1rem',
              }}
              onClick={e => { e.stopPropagation(); window.open(project.demo, '_blank'); }}
            >
              <FiExternalLink />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: hovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'white', borderRadius: '50%',
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', fontSize: '1.1rem',
              }}
              onClick={e => { e.stopPropagation(); window.open(project.github, '_blank'); }}
            >
              <FiGithub />
            </motion.div>
          </motion.div>

          {project.featured && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--gradient)', color: 'white',
              padding: '3px 10px', borderRadius: 50,
              fontSize: '0.72rem', fontWeight: 700,
            }}>
              ⭐ Featured
            </div>
          )}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.5)', color: 'white',
            padding: '3px 10px', borderRadius: 50,
            fontSize: '0.72rem', fontWeight: 600,
            backdropFilter: 'blur(4px)',
          }}>
            {project.category}
          </div>
        </div>

        <div style={{ padding: '20px 22px' }}>
          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>
            {project.title}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>
            {project.description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {project.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
            {project.tags.length > 3 && (
              <span className="tag">+{project.tags.length - 3}</span>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && <ProjectModal project={project} onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function Projects() {
  const { data } = useApp();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [filter, setFilter] = useState('All Projects');

  const categories = ['All Projects', ...new Set(data.projects.map(p => p.category))];
  const filtered = filter === 'All Projects' ? data.projects : data.projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Featured Projects</h2>
          <div className="section-line" />
          <p className="section-subtitle">A showcase of my recent work and personal projects</p>
        </motion.div>

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}
        >
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(cat)}
              style={{
                padding: '10px 22px', borderRadius: 50,
                border: filter === cat ? 'none' : '2px solid var(--border)',
                background: filter === cat ? 'var(--gradient)' : 'var(--bg-card)',
                color: filter === cat ? 'white' : 'var(--text)',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                boxShadow: filter === cat ? '0 4px 20px rgba(108,99,255,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 28,
            }}
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
