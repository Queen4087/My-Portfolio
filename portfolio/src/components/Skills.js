import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaReact, FaNodeJs, FaPython, FaDocker, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiJavascript, SiTailwindcss, SiMongodb, SiPostgresql } from 'react-icons/si';
import { useApp } from '../context/AppContext';

const iconMap = {
  FaReact: <FaReact />, FaNodeJs: <FaNodeJs />, FaPython: <FaPython />,
  FaDocker: <FaDocker />, FaGitAlt: <FaGitAlt />,
  SiTypescript: <SiTypescript />, SiJavascript: <SiJavascript />,
  SiTailwindcss: <SiTailwindcss />, SiMongodb: <SiMongodb />, SiPostgresql: <SiPostgresql />,
};

const categoryColors = {
  Frontend: '#6c63ff',
  Backend: '#ec4899',
  Database: '#f59e0b',
  DevOps: '#10b981',
};

function SkillCard({ skill, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const color = categoryColors[skill.category] || '#6c63ff';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, y: -4 }}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 16,
        padding: '20px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', color,
          border: `1px solid ${color}30`,
        }}>
          {iconMap[skill.icon] || '⚡'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{skill.name}</div>
          <div style={{
            fontSize: '0.72rem', fontWeight: 600,
            color, textTransform: 'uppercase', letterSpacing: 0.5,
          }}>{skill.category}</div>
        </div>
        <div style={{
          marginLeft: 'auto',
          fontWeight: 800, fontSize: '1rem',
          color,
        }}>{skill.level}%</div>
      </div>

      <div style={{
        height: 6, background: 'var(--border)',
        borderRadius: 3, overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: index * 0.05 + 0.3, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            borderRadius: 3,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { data } = useApp();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const categories = [...new Set(data.skills.map(s => s.category))];

  return (
    <section id="skills" className="section" style={{ background: 'var(--gradient-soft)' }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">My Skills</h2>
          <div className="section-line" />
          <p className="section-subtitle">Technologies and tools I work with</p>
        </motion.div>

        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 40 }}>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.1rem', fontWeight: 700,
                color: categoryColors[cat] || 'var(--primary)',
                marginBottom: 20,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: categoryColors[cat] || 'var(--primary)',
                display: 'inline-block',
              }} />
              {cat}
            </motion.h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {data.skills.filter(s => s.category === cat).map((skill, i) => (
                <SkillCard key={skill.id} skill={skill} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
