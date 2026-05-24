import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';

export default function Preloader({ onComplete }) {
  const [textIndex, setTextIndex] = useState(0);
  
  const lines = [
    "INITIALIZING KERN_SYS...",
    "LOADING GEOMETRY...",
    "MOUNTING HARDWARE INTERFACES...",
    "SYS.STAT.ONLINE"
  ];

  useEffect(() => {
    if (textIndex < lines.length) {
      const timer = setTimeout(() => setTextIndex((prev) => prev + 1), 350);
      return () => clearTimeout(timer);
    } else {
      // Wait a moment after the final line before lifting the curtain
      const completeTimer = setTimeout(() => onComplete(), 800);
      return () => clearTimeout(completeTimer);
    }
  }, [textIndex, onComplete]);

  return (
    <m.div
      className="fixed inset-0 z-[99999] bg-[#030303] flex items-center justify-center overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // High-end cinematic easing
    >
      <div className="flex flex-col items-start font-mono text-[10px] text-zinc-500 tracking-[0.3em] w-64">
        {lines.slice(0, textIndex + 1).map((line, i) => (
          <m.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={i === lines.length - 1 ? "text-emerald-500 mt-4 font-bold" : "mb-2"}
          >
            {line}
          </m.div>
        ))}
      </div>
    </m.div>
  );
}