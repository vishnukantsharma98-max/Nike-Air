'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Levitate from './Levitate';
import MagneticHover from './MagneticHover';
import VelocityStretch from './VelocityStretch';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const levitateAmplitude = useMemo(
    () => Math.floor(Math.random() * 6) + 5,
    []
  );

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <VelocityStretch strength={0.6}>
      <Levitate amplitude={levitateAmplitude}>
        <MagneticHover>
          <div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Product Image Area */}
            <div
              className="relative h-64 rounded-xl overflow-hidden"
              style={{ background: product.gradient }}
            >
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-4 drop-shadow-2xl z-10 hover:scale-110 transition-transform duration-500"
                />
              )}
              {/* Animated Shine Effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 50%, transparent 55%)',
                  backgroundSize: '200% 100%',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.7s ease',
                  animation: isHovered ? 'cardShine 1.5s ease-in-out infinite' : 'none',
                }}
              />

              {/* Product Name Overlay */}
              <div className="absolute bottom-4 left-4">
                <span className="text-white/40 text-6xl font-black select-none leading-none tracking-tighter">
                  {product.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.colorway}</p>
              <p className="text-xl font-bold text-cyan-400">${product.price}</p>

              {/* Feature Tags */}
              {product.features && product.features.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              {/* Add to Cart Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={`w-full py-3 mt-4 rounded-xl border font-semibold transition-all duration-300 ${
                  added
                    ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                    : 'border-cyan-400/30 text-cyan-400 bg-cyan-400/5 hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]'
                }`}
              >
                {added ? '✓ Added' : 'Add to Cart'}
              </motion.button>
            </div>
          </div>
        </MagneticHover>
      </Levitate>
    </VelocityStretch>
  );
}
