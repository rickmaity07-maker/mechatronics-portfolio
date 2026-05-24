import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

export default function CinematicExperience() {
  const [hasBooted, setHasBooted] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const lines = [
    "INITIALIZING KERN_SYS...",
    "LOADING GEOMETRY...",
    "MOUNTING HARDWARE INTERFACES...",
    "SYS.STAT.ONLINE"
  ];

  // 1. SMOOTH SCROLLING ENGINE
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-style easing curve
      direction: 'vertical',
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // 2. SYSTEM BOOT PRELOADER LOGIC
  useEffect(() => {
    if (textIndex < lines.length) {
      const timer = setTimeout(() => setTextIndex((prev) => prev + 1), 350);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setHasBooted(true), 800);
      return () => clearTimeout(timer);
    }
  }, [textIndex, lines.length]);

  return (
    <>
      {/* 3. FILM GRAIN OVERLAY */}
      <div 
        className="pointer-events-none fixed inset-0 z-[99997] h-full w-full opacity-[0.03] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }}
      />

      {/* RENDER THE BOOT SCREEN UNTIL COMPLETE */}
      <AnimatePresence>
        {!hasBooted && (
          <m.div
            className="fixed inset-0 z-[99999] bg-[#030303] flex items-center justify-center overflow-hidden"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
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
        )}
      </AnimatePresence>
    </>
  );
}