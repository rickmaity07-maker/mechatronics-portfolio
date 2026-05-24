import React, { useState, useEffect, useRef, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { m, LazyMotion, domAnimation, AnimatePresence, useReducedMotion } from 'framer-motion';
import Lenis from '@studio-freight/lenis'; 

import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Education from './pages/Education'; 
import Admin from './pages/Admin';

// ==========================================
// 🎛️ MASTER SYSTEM CONFIGURATION
// ==========================================
const SYSTEM_CONFIG = {
  enableSmoothScroll: true,       
  enableFilmGrain: true,          
  enableBootSequence: true,       
  enableAmbientBackground: true,  
  supabaseUrl: 'YOUR_SUPABASE_PROJECT_ID.supabase.co' 
};

// --- INLINED COMPONENT: 404 Not Found ---
const NotFound = () => (
  <m.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
  >
    <div className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase mb-4 animate-pulse">ERR_404: DIRECTORY_NOT_FOUND</div>
    <h1 className="text-5xl font-light text-white mb-8 tracking-tight">Signal Lost</h1>
    <p className="text-zinc-500 max-w-md mb-8">The coordinate you are looking for does not exist in this architecture.</p>
    <Link to="/" className="px-8 py-3 border border-zinc-700 text-zinc-300 text-xs tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300">
      Return to Base
    </Link>
  </m.div>
);

// --- INLINED COMPONENT: Error Boundary ---
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center text-center px-6">
          <div className="text-red-500 font-mono text-xs tracking-[0.3em] uppercase mb-4">CRITICAL_SYSTEM_FAILURE</div>
          <h1 className="text-4xl font-light text-white mb-6">UI Subsystem Offline</h1>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white text-black text-xs tracking-widest uppercase font-bold hover:bg-zinc-200 transition-colors">
            Reboot Interface
          </button>
        </div>
      );
    }
    return this.props.children; 
  }
}

// --- INLINED COMPONENT: Boot Sequence ---
const BootSequence = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const lines = [
    "INITIALIZING KERN_SYS...",
    "LOADING GEOMETRY...",
    "MOUNTING HARDWARE INTERFACES...",
    "SYS.STAT.ONLINE"
  ];

  useEffect(() => {
    if (textIndex < lines.length) {
      const timer = setTimeout(() => setTextIndex((prev) => prev + 1), 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => onComplete(), 600);
      return () => clearTimeout(timer);
    }
  }, [textIndex, lines.length, onComplete]);

  return (
    <m.div
      className="fixed inset-0 z-[99999] bg-[#030303] flex items-center justify-center overflow-hidden"
      initial={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex flex-col items-start font-mono text-[10px] text-zinc-500 tracking-[0.3em] w-64">
        {lines.slice(0, textIndex + 1).map((line, i) => (
          <m.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={i === lines.length - 1 ? "text-emerald-500 mt-4 font-bold" : "mb-2"}>
            {line}
          </m.div>
        ))}
      </div>
    </m.div>
  );
};

// --- COMPONENT: Animated Routes ---
function AnimatedRoutes() {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    const routeName = location.pathname === '/' ? 'Profile' : location.pathname.substring(1);
    setPageTitle(`Mapsd to ${routeName} page`);
  }, [location]);
  
  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic="true">{pageTitle}</div>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/education" element={<Education />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="/admin" element={<Admin />} />
          {/* THE FIX: The 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [isOwner, setIsOwner] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasBooted, setHasBooted] = useState(!SYSTEM_CONFIG.enableBootSequence);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef(null);

  useEffect(() => {
    if (SYSTEM_CONFIG.supabaseUrl && SYSTEM_CONFIG.supabaseUrl !== 'YOUR_SUPABASE_PROJECT_ID.supabase.co') {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = `https://${SYSTEM_CONFIG.supabaseUrl}`;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (!SYSTEM_CONFIG.enableSmoothScroll || prefersReducedMotion) return;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (localStorage.getItem('rm_owner') === 'true') setIsOwner(true);
  }, []);

  const handleMouseMove = (e) => {
    if (containerRef.current && !prefersReducedMotion) {
      containerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <LazyMotion features={domAnimation}>
          
          {SYSTEM_CONFIG.enableFilmGrain && (
            <div className="pointer-events-none fixed inset-0 z-[99997] h-full w-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          )}

          <AnimatePresence mode="wait">
            {!hasBooted && <BootSequence key="boot" onComplete={() => setHasBooted(true)} />}
          </AnimatePresence>

          <div ref={containerRef} className="relative min-h-screen bg-[#030303] text-zinc-400 font-sans selection:bg-zinc-800 selection:text-white overflow-x-hidden" onMouseMove={handleMouseMove}>
            
            <a href="#main-content" className="absolute left-4 top-4 z-[99999] -translate-y-24 rounded-sm bg-emerald-500 px-4 py-2 text-sm font-bold text-black transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shadow-2xl">
              Skip to main content
            </a>

            {SYSTEM_CONFIG.enableAmbientBackground && !prefersReducedMotion && (
              <>
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                  <m.div animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-800/10 blur-[120px] will-change-transform transform-gpu backface-hidden" />
                  <m.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-10%] right-[-20%] w-[50%] h-[50%] rounded-full bg-zinc-700/5 blur-[100px] will-change-transform transform-gpu backface-hidden" />
                </div>
                <div className="fixed inset-0 z-0 pointer-events-none hidden md:block" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)', WebkitMaskImage: 'radial-gradient(circle 500px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)', maskImage: 'radial-gradient(circle 500px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 0%, transparent 100%)' }}></div>
                <div className="fixed inset-0 z-0 pointer-events-none hidden md:block" style={{ background: 'radial-gradient(circle 400px at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(255,255,255,0.02), transparent 80%)' }}></div>
              </>
            )}

            <nav className="fixed w-full z-50 top-0 border-b border-zinc-800/50 bg-[#030303]/70 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" aria-label="Go to homepage" className="text-xl font-bold tracking-widest text-zinc-100 z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm">RM.</Link>
                
                <div className="space-x-8 text-sm uppercase tracking-wider hidden md:flex items-center relative z-50">
                  <Link to="/" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-sm">Profile</Link>
                  <Link to="/experience" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-sm">Experience</Link>
                  <Link to="/education" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-sm">Education</Link>
                  <Link to="/projects" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-sm">Projects</Link>
                  <Link to="/skills" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#030303] rounded-sm">Skills</Link>
                  {isOwner && <Link to="/admin" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors border-l border-zinc-800 pl-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm">ADMIN</Link>}
                </div>

                <button aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"} aria-expanded={isMobileMenuOpen} className="md:hidden text-zinc-400 hover:text-white z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                  </svg>
                </button>
              </div>

              {isMobileMenuOpen && (
                <div className="md:hidden bg-[#030303] border-b border-zinc-800/50 px-6 py-6 flex flex-col space-y-6 text-sm uppercase tracking-wider absolute w-full top-full z-50">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Profile</Link>
                  <Link to="/experience" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Experience</Link>
                  <Link to="/education" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Education</Link>
                  <Link to="/projects" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Projects</Link>
                  <Link to="/skills" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Skills</Link>
                  {isOwner && <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-emerald-500 hover:text-emerald-400 font-bold transition-colors pt-4 border-t border-zinc-800">ADMIN</Link>}
                </div>
              )}
            </nav>

            <main id="main-content" className="relative z-10 pt-32 pb-16 px-6 max-w-7xl mx-auto min-h-screen">
              <AnimatedRoutes />
            </main>
          </div>
        </LazyMotion>
      </Router>
    </ErrorBoundary>
  );
}