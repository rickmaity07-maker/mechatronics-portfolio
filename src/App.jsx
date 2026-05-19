import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Admin from './pages/Admin';

export default function App() {
  // 1. SECURITY STATE (For the Admin Portal)
  const [isOwner, setIsOwner] = useState(false);
  
  // 2. UI STATE (For the Mobile Menu toggle)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const vipPass = localStorage.getItem('rm_owner');
    if (vipPass === 'true') {
      setIsOwner(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-400 font-sans">
        <nav className="fixed w-full z-50 top-0 border-b border-zinc-800/50 bg-zinc-950/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            <Link to="/" className="text-xl font-bold tracking-widest text-zinc-100 z-50">RM.</Link>
            
            {/* --- DESKTOP MENU (Hidden on phones) --- */}
            <div className="space-x-8 text-sm uppercase tracking-wider hidden md:flex items-center">
              <Link to="/" className="hover:text-white transition-colors">Profile</Link>
              <Link to="/experience" className="hover:text-white transition-colors">Experience</Link>
              <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
              {isOwner && (
                <Link to="/admin" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors border-l border-zinc-800 pl-8">
                  ADMIN PORTAL
                </Link>
              )}
            </div>

            {/* --- MOBILE HAMBURGER BUTTON (Hidden on desktops) --- */}
            <button 
              className="md:hidden text-zinc-400 hover:text-white z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  /* 'X' Close Icon */
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  /* 'Hamburger' Menu Icon */
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* --- MOBILE DROPDOWN MENU --- */}
          {/* This only renders if isMobileMenuOpen is true AND we are on a small screen */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-zinc-950 border-b border-zinc-800/50 px-6 py-6 flex flex-col space-y-6 text-sm uppercase tracking-wider animate-fade-in-up">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Profile</Link>
              <Link to="/experience" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-white transition-colors">Experience</Link>
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

        <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
