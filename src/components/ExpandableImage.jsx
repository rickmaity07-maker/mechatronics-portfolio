import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExpandableImage({ src, alt, className, layoutId }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      {/* The inline image that users see on the page */}
      <motion.img
        src={src}
        alt={alt}
        className={`cursor-pointer object-cover ${className}`}
        whileHover={{ scale: 1.02 }}
        transition={{ ease: "easeOut", duration: 0.3 }}
        onClick={() => setIsOpen(true)}
        layoutId={layoutId}
      />

      {/* The full-screen overlay that pops up when clicked */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-6 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.img
              src={src}
              alt={`Full screen ${alt}`}
              className="max-h-full max-w-full object-contain"
              layoutId={layoutId}
            />
            <button
              className="absolute top-8 right-8 text-white tracking-widest uppercase text-xs hover:text-zinc-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              CLOSE ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}