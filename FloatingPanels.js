'use client';

import { motion } from 'framer-motion';
import Levitate from './Levitate';
import VelocityStretch from './VelocityStretch';

const panelAnimation = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
  viewport: { once: true, amount: 0.3 },
};

export default function FloatingPanels() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-32">
      {/* Decorative glowing cyan orb */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        {/* Left Panel — Zero-G Foam™ */}
        <motion.div
          {...panelAnimation}
          className="flex-1"
        >
          <VelocityStretch strength={0.8}>
            <Levitate amplitude={4}>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Nike ZoomX Foam™
                </h3>
                <div className="w-12 h-1 bg-cyan-400 rounded mb-6" />
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Our proprietary cushioning system uses aerospace-grade Nike ZoomX
                  foam that adapts to your stride in real time. Each step is met with
                  an 85% energy return, delivering weightless comfort that
                  defies conventional footwear engineering.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-gray-400">
                      Adaptive micro-cell density that responds to pressure distribution
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-gray-400">
                      40% energy return on every stride for effortless propulsion
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-gray-400">
                      Temperature-neutral polymer maintains performance in any climate
                    </span>
                  </li>
                </ul>
              </div>
            </Levitate>
          </VelocityStretch>
        </motion.div>

        {/* Right Panel — Carbon Core™ */}
        <motion.div
          {...panelAnimation}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="flex-1"
        >
          <VelocityStretch strength={0.8}>
            <Levitate amplitude={4}>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Flyknit Core™
                </h3>
                <div className="w-12 h-1 bg-cyan-400 rounded mb-6" />
                <p className="text-gray-400 mb-6 leading-relaxed">
                  A full-length carbon fiber plate engineered for maximum rigidity
                  with minimal weight. The lattice structure channels force through
                  natural biomechanical pathways, transforming every footfall into
                  forward momentum.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-gray-400">
                      Uni-directional carbon fiber weave for torsional stability
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-gray-400">
                      Weighs only 28g while supporting up to 200kg of dynamic load
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-gray-400">
                      Snap-fit modular design for customizable flex zones
                    </span>
                  </li>
                </ul>
              </div>
            </Levitate>
          </VelocityStretch>
        </motion.div>
      </div>
    </section>
  );
}
