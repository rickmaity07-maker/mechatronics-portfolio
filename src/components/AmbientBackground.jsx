import React, { useRef } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

export default function AmbientBackground({ children }) {
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div 
        ref={containerRef} 
        className="relative min-h-screen bg-[#030303] overflow-x-hidden" 
        onMouseMove={handleMouseMove}
      >
        {/* --- LAYER 1: BREATHING AMBIENT LIGHTS --- */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <m.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-800/10 blur-[120px] will-change-transform transform-gpu"
          />
          <m.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] rounded-full bg-zinc-700/5 blur-[100px] will-change-transform transform-gpu"
          />
        </div>

        {/* --- LAYER 2: INTERACTIVE CAD GRID --- */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none hidden md:block"
          style={{
            backgroundSize: '40px 40px',
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            WebkitMaskImage: 'radial-gradient(circle 500px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
            maskImage: 'radial-gradient(circle 500px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
          }}
        ></div>

        {/* --- LAYER 3: MOUSE FLASHLIGHT GLOW --- */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none hidden md:block"
          style={{
            background: 'radial-gradient(circle 400px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.02), transparent 80%)',
          }}
        ></div>

        {/* --- MAIN PAGE CONTENT RENDERED HERE --- */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </LazyMotion>
  );
}