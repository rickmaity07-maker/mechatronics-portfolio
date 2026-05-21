import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [data, setData] = useState({ profile: null, projects: [], skills: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [copiedItem, setCopiedItem] = useState(null);
  
  // Controls the full-screen image expansion
  const [isImageOpen, setIsImageOpen] = useState(false);

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
                <div className="relative group py-2">
                  <button className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors">CONTACTS ▾</button>
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="bg-black border border-zinc-800 p-6 flex flex-col gap-4 min-w-[200px] shadow-2xl">
                      {profile.email && (
                        <div className="flex justify-between items-center gap-6">
                          <span className="text-[10px] text-zinc-500 uppercase">Email</span>
                          <button onClick={() => handleCopy(profile.email)} className="text-xs text-white hover:text-zinc-300">
                            {copiedItem === profile.email ? '✓' : 'Copy'}
                          </button>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex justify-between items-center gap-6">
                          <span className="text-[10px] text-zinc-500 uppercase">Phone</span>
                          <button onClick={() => handleCopy(profile.phone)} className="text-xs text-white hover:text-zinc-300">
                            {copiedItem === profile.phone ? '✓' : 'Copy'}
                          </button>
                        </div>
                      )}
                      {profile.linkedin && (
                        <div className="flex justify-between items-center gap-6">
                          <span className="text-[10px] text-zinc-500 uppercase">LinkedIn</span>
                          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-xs text-white hover:text-zinc-300">Open ↗</a>
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

      {/* 2. FEATURED PROJECTS CAROUSEL (With Hover Magnification) */}
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
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
              
              <h4 className="text-4xl font-light text-white mb-2 relative z-10 drop-shadow-lg">{active.title}</h4>
              
              {/* THE FIX: Now safely checks for short_desc first */}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 cursor-pointer" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsImageOpen(false)}
          >
            <motion.img 
              src={profile.photo} 
              className="max-h-full max-w-full object-contain" 
              layoutId="profile-img" 
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