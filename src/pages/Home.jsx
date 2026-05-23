import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [data, setData] = useState({ profile: null, projects: [], skills: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [copiedItem, setCopiedItem] = useState(null);
  
  // Controls the full-screen image expansion & mobile contacts menu
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  // Close the mobile contacts dropdown if the user taps anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.contacts-dropdown')) {
        setIsContactsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      const [pRes, projRes, sRes] = await Promise.all([
        supabase.from('Profile').select('*').limit(1),
        supabase.from('Projects').select('*').order('id', { ascending: false }),
        supabase.from('Skills').select('*')
      ]);
      setData({ profile: pRes.data?.[0], projects: projRes.data || [], skills: sRes.data || [] });
      setIsLoading(false);
    };
    fetchHomeData();
  }, []);

  const handleNext = () => setCurrentProjectIndex((prev) => (prev === data.projects.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentProjectIndex((prev) => (prev === 0 ? data.projects.length - 1 : prev - 1));

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (isLoading) return <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm">Loading Interface...</div>;

  const { profile, projects, skills } = data;
  const active = projects[currentProjectIndex];

  return (
    <div className="relative z-10 pb-24">
      {/* 1. HERO SECTION */}
      <div className="min-h-[85vh] flex items-center px-6 max-w-6xl mx-auto pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
          <div>
            <h2 className="text-zinc-500 tracking-[0.2em] text-xs uppercase mb-4">{profile.role}</h2>
            <h1 className="text-6xl md:text-8xl font-light text-white mb-8">{profile.name}</h1>
            <div className="h-px w-20 bg-zinc-700 mb-8"></div>
            <p className="text-zinc-400 leading-relaxed font-light mb-8 max-w-md">{profile.bio}</p>
            
            <div className="flex gap-6 items-center">
              <Link to="/projects" className="px-8 py-4 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-all">VIEW PROJECTS</Link>
              
              {(profile.email || profile.phone || profile.linkedin) && (
                <div className="relative py-2 group contacts-dropdown">
                  {/* Toggles state on mobile tap, relies on group-hover for desktop */}
                  <button 
                    onClick={() => setIsContactsOpen(!isContactsOpen)}
                    className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
                  >
                    CONTACTS <span className="text-[8px]">▼</span>
                  </button>
                  
                  {/* THE FIX: Replaced left-0 with right-0 md:right-auto md:left-0 */}
                  <div className={`absolute top-full right-0 md:right-auto md:left-0 pt-4 z-[999] transition-all duration-300 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 ${isContactsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    
                    {/* THE FIX: Adjusted min-width for mobile screens */}
                    <div className="bg-zinc-900/70 backdrop-blur-2xl border border-zinc-700 p-6 flex flex-col gap-6 min-w-[260px] md:min-w-[280px] shadow-2xl rounded-sm">
                      
                      {profile.email && (
                        <div className="flex justify-between items-center gap-6 border-b border-zinc-800/50 pb-4">
                          <span className="text-[10px] text-zinc-500 uppercase">Email</span>
                          <div className="flex gap-4">
                            <a href={`mailto:${profile.email}`} className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors py-1">OPEN ↗</a>
                            <button onClick={() => handleCopy(profile.email)} className="text-xs text-white hover:text-zinc-400 transition-colors py-1">
                              {copiedItem === profile.email ? '✓ COPIED' : 'COPY'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {profile.phone && (
                        <div className="flex justify-between items-center gap-6 border-b border-zinc-800/50 pb-4">
                          <span className="text-[10px] text-zinc-500 uppercase">Phone</span>
                          <div className="flex gap-4">
                            <a href={`tel:${profile.phone}`} className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors py-1">CALL ↗</a>
                            <button onClick={() => handleCopy(profile.phone)} className="text-xs text-white hover:text-zinc-400 transition-colors py-1">
                              {copiedItem === profile.phone ? '✓ COPIED' : 'COPY'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {profile.linkedin && (
                        <div className="flex justify-between items-center gap-6">
                          <span className="text-[10px] text-zinc-500 uppercase">LinkedIn</span>
                          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors py-1">
                            CONNECT ↗
                          </a>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* INTERACTIVE PROFILE IMAGE */}
          {profile.photo && (
            <motion.div 
              className="w-full md:w-[400px] aspect-[4/5] ml-auto overflow-hidden border border-zinc-800 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              onClick={() => setIsImageOpen(true)}
            >
              <motion.img 
                src={profile.photo} 
                className="w-full h-full object-cover" 
                layoutId="profile-img" 
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. FEATURED PROJECTS CAROUSEL */}
      {active && (
        <div className="max-w-5xl mx-auto px-6 mt-24">
          <h3 className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-12 text-center">Featured Work</h3>
          <AnimatePresence mode="wait">
            <motion.div 
              key={active.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              whileHover={{ scale: 1.01 }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="relative border border-zinc-800 bg-zinc-950 p-12 min-h-[400px] flex flex-col justify-end overflow-hidden group"
            >
              {active.image && (
                <img 
                  src={active.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500" 
                  alt={active.title}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
              
              <h4 className="text-4xl font-light text-white mb-2 relative z-10 drop-shadow-lg">{active.title}</h4>
              <p className="text-zinc-400 max-w-xl relative z-10">{active.short_desc || active.desc}</p>
              
              <div className="flex gap-4 mt-8 relative z-10">
                <button onClick={handlePrev} className="text-zinc-500 hover:text-white transition-colors">← PREV</button>
                <button onClick={handleNext} className="text-zinc-500 hover:text-white transition-colors">NEXT →</button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="text-center mt-12">
            <Link to="/projects" className="text-zinc-400 text-xs tracking-[0.2em] uppercase hover:text-white border-b border-zinc-700 pb-1 transition-colors">View More Projects</Link>
          </div>
        </div>
      )}

      {/* 3. SKILLS MARQUEE */}
      <div className="w-full py-12 border-y border-zinc-900 overflow-hidden mt-24">
        <motion.div className="flex gap-12" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          {[...skills, ...skills, ...skills].map((s, i) => (
            <span key={i} className="text-zinc-600 tracking-[0.3em] uppercase text-sm whitespace-nowrap">✦ {s.name}</span>
          ))}
        </motion.div>
      </div>

      {/* FULL-SCREEN IMAGE MODAL */}
      <AnimatePresence>
        {isImageOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6 cursor-pointer" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsImageOpen(false)}
          >
            <motion.img 
              src={profile.photo} 
              className="max-h-full max-w-full object-contain" 
              layoutId="profile-img" 
              alt="Profile Full Screen"
            />
            <button 
              className="absolute top-8 right-8 text-white tracking-widest uppercase text-xs hover:text-zinc-400"
              onClick={() => setIsImageOpen(false)}
            >
              CLOSE ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}