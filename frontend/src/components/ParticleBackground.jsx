import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      pointerEvents: 'none',
      background: 'radial-gradient(circle at center, #111 0%, #000 100%)'
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 0, 
            y: `${p.y}vh`, 
            x: `${p.x}vw` 
          }}
          animate={{ 
            opacity: [0, 0.5, 0], 
            y: [`${p.y}vh`, `${p.y - 20}vh`] 
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: '#c9a84c',
            boxShadow: '0 0 10px #c9a84c'
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;
