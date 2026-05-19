import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Admin from './pages/Admin';

export default function App() {
  // 1. Create a state to hold your VIP status
  const [isOwner, setIsOwner] = useState(false);

  // 2. Check the browser's memory the second the website loads
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
            <Link to="/" className="text-xl font-bold tracking-widest text-zinc-100">RM.</Link>
            <div className="space-x-8 text-sm uppercase tracking-wider hidden md:block">
              <Link to="/" className="hover:text-white transition-colors">Profile</Link>
              <Link to="/experience" className="hover:text-white transition-colors">Experience</Link>
              <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
              <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
              
              {/* 3. CONDITIONAL RENDERING: Only show if isOwner is true! */}
              {isOwner && (
                <Link to="/admin" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors border-l border-zinc-800 pl-8">
                  ADMIN PORTAL
                </Link>
              )}
              
            </div>
          </div>
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