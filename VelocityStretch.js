'use client';

import { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export default function VelocityStretch({ children, className, strength = 1 }) {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  
  // Get the vertical scroll velocity (px/s)
  const scrollVelocity = useVelocity(scrollY);

  // Smooth the velocity to prevent jittery transitions
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 60,
    stiffness: 400,
    mass: 0.2
  });

  // Map velocity to a vertical stretch (scaleY)
  // At rest (velocity = 0), scaleY is 1.0.
  // At high velocities (e.g. +/- 3000 px/s), scaleY stretches up to 1.10.
  const scaleY = useTransform(
    smoothVelocity,
    [-3000, -1500, 0, 1500, 3000],
    [1 + 0.1 * strength, 1 + 0.04 * strength, 1, 1 + 0.04 * strength, 1 + 0.1 * strength]
  );

  // Map velocity to a subtle vertical skew to mimic drag/inertia
  const skewY = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [-4 * strength, 0, 4 * strength]
  );

  // Map velocity to a slight vertical translation offset (lag effect)
  const yOffset = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [15 * strength, 0, -15 * strength]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        scaleY,
        skewY,
        y: yOffset,
        transformOrigin: 'center center',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
