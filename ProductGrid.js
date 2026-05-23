'use client';

import { motion } from 'framer-motion';
import products from '@/data/products';
import ProductCard from './ProductCard';
import VelocityStretch from './VelocityStretch';

export default function ProductGrid() {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-16"
      >
        <VelocityStretch strength={1.2}>
          <p className="text-sm uppercase tracking-widest text-cyan-400 mb-4">
            The Collection
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Engineered for the Impossible
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
        </VelocityStretch>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Decorative Bottom Gradient Orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
    </section>
  );
}
