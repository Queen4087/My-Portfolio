import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiBook } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

function TimelineItem({ item, index, isLeft }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-end' : 'flex-start',
        paddingRight: isLeft ? 'calc(50% + 30px)' : 0,
        paddingLeft: isLeft ? 0 : 'calc(50% + 30px)',
        marginBottom: 40,
        position: 'relative',
      }}
      className="timeline-item"
    >
      {/* Center dot */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: 20,
        transform: 'translateX(-50%)',
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: item.type === 'work' ? 'var(--gradient)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.1rem',
        zIndex: 2,
        boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
      }}>
        {item.type === 'work' ? <FiBriefcase /> : <FiBook />}
      </div>

      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 16,
        padding: '22px 24px',
        maxWidth: 420,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '3px 12px',
          borderRadius: 50,
          background: item.type === 'work' ? 'var(--gradient-soft)' : 'rgba(245,158,11,0.1)',
          color: item.type === 'work' ? 'var(--primary)' : '#f59e0b',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginBottom: 10,
          border: `1px solid ${item.type === 'work' ? 'rgba(108,99,255,0.2)' : 'rgba(245,158,11,0.2)'}`,
        }}>
          {item.period}
        </div>
        <h3 style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700, fontSize: '1.05rem',
          marginBottom: 4,
        }}>
          {item.title}
        </h3>
        <div style={{
          color: 'var(--primary)', fontWeight: 600,
          fontSize: '0.88rem', marginBottom: 10,
        }}>
          {item.company}
        </div>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.88rem', lineHeight: 1.7,
        }}>
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const { data } = useApp();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="experience" className="section" style={{ background: 'var(--gradient-soft)' }} ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Experience & Education</h2>
          <div className="section-line" />
          <p className="section-subtitle">My professional journey and academic background</p>
        </motion.div>

        <div style={{ position: 'relative', maxWidth: 900, margin: '0 auto' }}>
          {/* Center line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            background: 'var(--border)',
            transform: 'translateX(-50%)',
          }} />

          {data.experience.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} isLeft={i % 2 === 0} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-item {
            padding-left: 60px !important;
            padding-right: 0 !important;
            justify-content: flex-start !important;
          }
          .timeline-item > div:last-child {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}
