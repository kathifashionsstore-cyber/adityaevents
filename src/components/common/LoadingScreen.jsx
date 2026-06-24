// src/components/common/LoadingScreen.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'completing' | 'exiting'
  const [displayText, setDisplayText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [particles, setParticles] = useState([]);
  const progressRef = useRef(0);
  const animFrameRef = useRef(null);
  const fullText = 'Adithya Event Management';

  // Generate particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * 2,
      tx: (Math.random() - 0.5) * 200,
      color: ['#D4AF37', '#FFD700', '#F7E7CE', '#E8B4A0', '#B8860B'][Math.floor(Math.random() * 5)],
      opacity: Math.random() * 0.6 + 0.4,
    }));
    setParticles(newParticles);
  }, []);

  // Progress animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const raw = elapsed / duration;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      const pct = Math.round(eased * 100);
      setProgress(pct);
      progressRef.current = pct;

      if (elapsed < duration) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setPhase('completing');
        // Fire confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#D4AF37', '#FFD700', '#F7E7CE', '#E8B4A0'],
          gravity: 0.5,
          scalar: 1.2,
        });
        setTimeout(() => {
          setPhase('exiting');
          setTimeout(() => onComplete?.(), 600);
        }, 400);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [onComplete]);

  // Typewriter effect
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowSubtitle(true), 500);
      }
    }, 65);
    return () => clearInterval(interval);
  }, []);

  // Mandala petals — 8 petals with staggered draw
  const petals = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const cx = 100 + Math.cos(angle) * 50;
    const cy = 100 + Math.sin(angle) * 50;
    return { id: i, angle: i * 45, cx, cy, delay: i * 0.2 };
  });

  return (
    <AnimatePresence>
      {phase !== 'exiting' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'radial-gradient(ellipse at center, var(--bg-dark-section) 0%, var(--bg-hero) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}vw`,
                bottom: '-10px',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                background: p.color,
                opacity: p.opacity,
                animation: `particleFloat ${p.duration}s ${p.delay}s infinite`,
                '--tx': `${p.tx}px`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Ambient gold glow behind mandala */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />

          {/* Mandala SVG Container */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: 'relative',
              marginBottom: '32px',
              width: '200px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{ animation: 'spinSlow 12s linear infinite', position: 'absolute' }}
            >
              {/* Outer spinning ring */}
              <circle
                cx="100" cy="100" r="95"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1"
                strokeDasharray="8 4"
                style={{ animation: 'spinSlow 20s linear infinite reverse' }}
              />
              {/* Middle ring */}
              <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
              {/* Petals */}
              {petals.map((p) => (
                <ellipse
                  key={p.id}
                  cx="100" cy="100"
                  rx="20" ry="38"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  strokeDasharray="200"
                  strokeDashoffset="0"
                  transform={`rotate(${p.angle}, 100, 100) translate(0, -38)`}
                  opacity="0.6"
                  style={{
                    animation: `borderDraw 0.8s ${p.delay}s ease forwards`,
                  }}
                />
              ))}
              {/* Inner circle */}
              <circle cx="100" cy="100" r="40" fill="var(--bg-hero)" stroke="#D4AF37" strokeWidth="2" />
            </svg>

            {/* Centered logo.webp */}
            <motion.img
              src="/logo.webp"
              alt="Logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                objectFit: 'cover',
                zIndex: 2,
                position: 'relative',
                border: '1.5px solid var(--gold)',
              }}
              onError={(e) => {
                // Fallback text if logo fails to load
                e.target.style.display = 'none';
              }}
            />
          </motion.div>

          {/* Company Name Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', marginBottom: '8px' }}
          >
            <h1
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
                color: '#D4AF37',
                minHeight: '3rem',
                letterSpacing: '2px',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
              }}
            >
              {displayText}
              <span
                style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '0.8em',
                  background: '#D4AF37',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'blinkCursor 0.8s infinite',
                }}
              />
            </h1>
          </motion.div>

          {/* Subtitle */}
          <AnimatePresence>
            {showSubtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.85rem',
                  color: 'rgba(247, 231, 206, 0.7)',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  marginBottom: '48px',
                }}
              >
                Vuyyuru • Andhra Pradesh
              </motion.p>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '280px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                height: '2px',
                background: 'rgba(212, 175, 55, 0.2)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #B8860B, #FFD700, #D4AF37)',
                  borderRadius: '999px',
                  boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
                }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0.1 }}
              />
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: 'rgba(212, 175, 55, 0.6)',
                letterSpacing: '2px',
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Decorative corner elements */}
          {[
            { top: '20px', left: '20px', rotate: '0deg' },
            { top: '20px', right: '20px', rotate: '90deg' },
            { bottom: '20px', left: '20px', rotate: '270deg' },
            { bottom: '20px', right: '20px', rotate: '180deg' },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderTop: '2px solid #D4AF37',
                borderLeft: '2px solid #D4AF37',
                transform: `rotate(${pos.rotate})`,
                ...pos,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
