'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function Levitate({
  children,
  amplitude = 8,
  duration = 4,
  delay: delayProp,
  className,
  ...rest
}) {
  const delay = useMemo(() => {
    if (delayProp !== undefined) return delayProp;
    return Math.random() * 2;
  }, [delayProp]);

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
