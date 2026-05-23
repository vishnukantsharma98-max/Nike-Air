'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { preloadImages, renderFrame, renderFallback } from '@/lib/canvasSequence';

const FRAME_COUNT = 100;

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const rafIdRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* ── Resize handler (DPR-aware) ─────────────────────────────── */
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  /* ── Scroll → frame mapping ─────────────────────────────────── */
  const handleScroll = useCallback(() => {
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;

      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / scrollable, 0), 1);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (loaded && imagesRef.current.length > 0) {
        const frameIndex = Math.min(
          Math.floor(progress * FRAME_COUNT),
          FRAME_COUNT - 1,
        );
        renderFrame(ctx, imagesRef.current, frameIndex, canvas);
      } else {
        renderFallback(ctx, canvas, progress);
      }
    });
  }, [loaded]);

  /* ── Setup effect ───────────────────────────────────────────── */
  useEffect(() => {
    updateCanvasSize();

    // Preload images
    preloadImages(FRAME_COUNT).then((imgs) => {
      imagesRef.current = imgs;
      setLoaded(true);
    });

    // Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCanvasSize);

    // Initial paint
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCanvasSize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll, updateCanvasSize]);

  // Re-paint whenever images finish loading
  useEffect(() => {
    if (loaded) handleScroll();
  }, [loaded, handleScroll]);

  /* ── Framer Motion variants ─────────────────────────────────── */
  const levitate = {
    initial: { y: 0 },
    animate: {
      y: [0, -12, 0],
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  const subtleLevitate = {
    initial: { y: 0 },
    animate: {
      y: [0, -6, 0],
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
    },
  };

  const arrowBounce = {
    initial: { y: 0, opacity: 0.6 },
    animate: {
      y: [0, 10, 0],
      opacity: [0.6, 1, 0.6],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
    },
  };

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Sticky canvas */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Overlay content */}
      <div style={styles.overlay}>
        <motion.h1
          style={styles.title}
          variants={levitate}
          initial="initial"
          animate="animate"
        >
          NIKE AIR
        </motion.h1>

        <motion.p
          style={styles.subtitle}
          variants={subtleLevitate}
          initial="initial"
          animate="animate"
        >
          ZERO GRAVITY FOOTWEAR
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          style={styles.scrollIndicator}
          variants={arrowBounce}
          initial="initial"
          animate="animate"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Inline styles ────────────────────────────────────────────── */

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '200vh',
  },

  canvas: {
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'block',
  },

  overlay: {
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 2,
    marginTop: '-100vh', // overlap the sticky canvas
  },

  title: {
    fontSize: 'clamp(4rem, 10vw, 10rem)',
    fontWeight: 900,
    color: 'rgba(255, 255, 255, 0.88)',
    margin: 0,
    lineHeight: 1,
    textAlign: 'center',
    letterSpacing: '-0.02em',
    textShadow: '0 0 60px rgba(0,0,0,0.5)',
    userSelect: 'none',
  },

  subtitle: {
    fontSize: 'clamp(0.85rem, 2vw, 1.4rem)',
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: '0.35em',
    marginTop: '1.5rem',
    textAlign: 'center',
    userSelect: 'none',
  },

  scrollIndicator: {
    position: 'absolute',
    bottom: '2.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
  },
};
