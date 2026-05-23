'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Levitate from './Levitate';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();

  return (
    <Levitate amplitude={2} duration={5}>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 8.2c-.4-1.2-1.3-2.3-2.4-3.1-4.7-3.6-11.4-1.6-14.8.4C3.8 7.3.3 12.5.1 16.6c-.1 2.3 1 4.5 3 5.4 1.9.9 4.3.4 5.9-.8 1.4-1.1 2.2-2.8 2.2-4.6 0-1.8-.7-3.4-1.9-4.5-1.1-1-2.7-1.4-4.2-1.2 1.3-2.1 3.5-3.4 5.9-3.7 3.6-.3 7.3 1.2 9.5 3.9.7.8 1.2 1.8 1.4 2.8.2.8.2 1.7.1 2.5 1.1-2.2 1.6-4.6 1.7-7.2.1-1.3.1-2.6 0-3.9z"/>
            </svg>
            <span className="text-white font-bold tracking-widest text-lg select-none">
              NIKE AIR
            </span>
          </div>

          {/* Cart Icon */}
          <button
            onClick={toggleCart}
            className="relative p-2 text-white hover:text-cyan-400 transition-colors duration-300"
            aria-label="Toggle cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>

            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="absolute -top-1 -right-1 bg-cyan-400 text-black text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </Levitate>
  );
}
