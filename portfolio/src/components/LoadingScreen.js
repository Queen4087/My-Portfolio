import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: 'var(--gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          color: 'white',
          fontWeight: 800,
          fontFamily: 'Poppins, sans-serif',
          boxShadow: '0 0 40px rgba(108,99,255,0.5)',
        }}
      >
        P
      </motion.div>
      <div className="spinner" />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
      >
        Loading portfolio...
      </motion.p>
    </motion.div>
  );
}
