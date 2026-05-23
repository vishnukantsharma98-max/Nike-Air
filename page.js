'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroCanvas from '@/components/HeroCanvas';
import FloatingPanels from '@/components/FloatingPanels';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import Levitate from '@/components/Levitate';

export default function Home() {
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Smooth spring for momentum scroll effects
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax transforms for various sections
  const heroParallax = useTransform(smoothProgress, [0, 0.3], [0, -80]);
  const midParallax = useTransform(smoothProgress, [0.2, 0.6], [0, -40]);

  return (
    <main ref={pageRef} className="relative min-h-screen bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* ═══ Hero Canvas Section ═══ */}
      <HeroCanvas />

      {/* ═══ Floating Technology Panels ═══ */}
      <motion.div style={{ y: midParallax }}>
        <FloatingPanels />
      </motion.div>

      {/* ═══ Transition Divider ═══ */}
      <div className="relative py-20 flex items-center justify-center overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="w-full max-w-xl h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,255,255,0.4), transparent)',
          }}
        />
      </div>

      {/* ═══ Product Grid ═══ */}
      <ProductGrid />

      {/* ═══ Footer ═══ */}
      <footer className="relative py-20 px-6 md:px-12 lg:px-20 border-t border-white/5">
        {/* Background Glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Brand */}
            <div>
              <Levitate amplitude={3} duration={5}>
                <h3 className="text-2xl font-bold text-white tracking-widest mb-4">NIKE AIR</h3>
              </Levitate>
              <p className="text-gray-500 text-sm leading-relaxed">
                Pioneering the future of footwear with Nike ZoomX technology.
                Engineered for those who refuse to be grounded.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Explore</h4>
              <ul className="space-y-3">
                {['Collection', 'Technology', 'About', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-500 hover:text-cyan-400 transition-colors duration-300 text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Stay Updated</h4>
              <p className="text-gray-500 text-sm mb-4">Get early access to new releases.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400/30 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-lg bg-cyan-400 text-black text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-shadow"
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs">
              © 2026 NIKE, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
