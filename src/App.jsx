import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Education from './pages/Education'; 
import Admin from './pages/Admin';

export default function App() {
  const [isOwner, setIsOwner] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // THE FIX: Added the ref to track the mouse across the entire website
  const containerRef = useRef(null);

  useEffect(() => {
    const vipPass = localStorage.getItem('rm_owner');
    if (vipPass === 'true') {
      setIsOwner(true);
    }
  }, []);

  // THE FIX: High-performance CSS variable updater for the flashlight glow
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  };

  return (
    <Router>
      {/* THE FIX: Wrap the entire app in the hardware-accelerated physics engine */}
      <LazyMotion features={domAnimation}>
        
        {/* We attach the mouse tracker to the absolute base of the website */}
        <div ref={containerRef} className="relative min-h-screen bg-[#030303] text-zinc-400 font-sans selection:bg-zinc-800 selection:text-white overflow-x-hidden" onMouseMove={handleMouseMove}>
          
          {/* --- NEW LAYER 1: BREATHING AMBIENT LIGHTS --- */}
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

          {/* --- NEW LAYER 2: INTERACTIVE CAD GRID --- */}
          <div 
            className="fixed inset-0 z-0 pointer-events-none hidden md:block"
            style={{
              backgroundSize: '40px 40px',
              backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
              WebkitMaskImage: 'radial-gradient(circle 500px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
              maskImage: 'radial-gradient(circle 500px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)',
            }}
          ></div>

          {/* --- NEW LAYER 3: MOUSE FLASHLIGHT GLOW --- */}
          <div 
            className="fixed inset-0 z-0 pointer-events-none hidden md:block"
            style={{
              background: 'radial-gradient(circle 400px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.02), transparent 80%)',
            }}
          ></div>


          {/* --- NAVBAR --- */}
          <nav className="fixed w-full z-50 top-0 border-b border-zinc-800/50 bg-[#030303]/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              
              <Link to="/" className="text-xl font-bold tracking-widest text-zinc-100 z-50">RM.</Link>
              
              {/* DESKTOP MENU */}
              <div className="space-x-8 text-sm uppercase tracking-wider hidden md:flex items-center relative z-50">
                <Link to="/" className="hover:text-white transition-colors">Profile</Link>
                <Link to="/experience" className="hover:text-white transition-colors">Experience</Link>
                <Link to="/education" className="hover:text-white transition-colors">Education</Link>
                <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
                <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
                {isOwner && (
                  <Link to="/admin" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors border-l border-zinc-800 pl-8">
                    ADMIN PORTAL
                  </Link>
                )}
              </div>

              {/* MOBILE HAMBURGER BUTTON */}
              <button 
                className="md:hidden text-zinc-400 hover:text-white z-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {isMobileMenuOpen && (
              <div className="md:hidden bg-[#030303] border-b border-zinc-800/50 px-6 py-6 flex flex-col space-y-6 text-sm uppercase tracking-wider absolute w-full top-full z-50">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Profile</Link>
                <Link to="/experience" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Experience</Link>
                <Link to="/education" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Education</Link>
                <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Projects</Link>
                <Link to="/skills" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Skills</Link>
                {isOwner && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-emerald-500 hover:text-emerald-400 font-bold transition-colors pt-4 border-t border-zinc-800">
                    ADMIN PORTAL
                  </Link>
                )}
              </div>
            )}
          </nav>

          {/* --- MAIN CONTENT LAYER --- */}
          <main className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/education" element={<Education />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
        </div>
      </LazyMotion>
    </Router>
  );
}