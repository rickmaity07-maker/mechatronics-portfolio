import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { m, AnimatePresence } from 'framer-motion';

// --- MINIMALIST UI ICONS ---
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function Home() {
  const [data, setData] = useState({ profile: null, projects: [], skills: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [copiedItem, setCopiedItem] = useState(null);
  
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);

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

  if (isLoading) return <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm animate-pulse">Loading Interface...</div>;

  const { profile, projects, skills } = data;
  const active = projects[currentProjectIndex];

  return (
    <div className="relative z-10 pb-24">
      
      <div className="w-full min-h-[90vh] pt-28 md:pt-32 px-6 max-w-6xl mx-auto flex flex-col justify-start">
        
        {/* THE FIX: Replaced simple grid with explicit CSS Coordinates for absolute Mobile/Desktop control */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-y-10 md:gap-y-0 md:gap-x-12 w-full mt-4 md:mt-0">
          
          {/* 1. TEXT BLOCK: Top on Mobile (order-1), Top-Left on Desktop (row 1, col 1) */}
          <div className="order-1 md:col-start-1 md:row-start-1 flex flex-col justify-end md:pb-8">
            
            {profile?.available_to_work && (
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm border border-emerald-900/50 bg-emerald-950/20 mb-8 backdrop-blur-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] text-emerald-400 tracking-[0.3em] uppercase font-mono mt-[1px]">Available for Opportunities</span>
              </div>
            )}

            <h2 className="text-zinc-500 tracking-[0.2em] text-xs uppercase mb-4">{profile.role}</h2>
            <h1 className="text-6xl md:text-8xl font-light text-white mb-8 drop-shadow-xl">{profile.name}</h1>
            <div className="h-px w-20 bg-gradient-to-r from-zinc-600 to-transparent mb-8"></div>
            <p className="text-zinc-400 leading-relaxed font-light max-w-md">{profile.bio}</p>
          </div>

          {/* 2. PHOTO BLOCK: Middle on Mobile (order-2), Right Side spanning both rows on Desktop (row 1-2, col 2) */}
          <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 flex items-center w-full md:w-auto">
            {profile.photo && (
              <m.div 
                className="w-full md:w-[400px] aspect-[4/5] overflow-hidden border border-zinc-800/50 shadow-2xl cursor-pointer bg-zinc-900 will-change-transform"
                whileHover={{ scale: 1.02 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
                onClick={() => setIsImageOpen(true)}
              >
                <m.img 
                  src={profile.photo} 
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" 
                  layoutId="profile-img" 
                />
              </m.div>
            )}
          </div>

          {/* 3. BUTTONS BLOCK: Bottom on Mobile (order-3), Bottom-Left on Desktop (row 2, col 1) */}
          <div className="order-3 md:col-start-1 md:row-start-2 flex items-start z-30 pt-2 md:pt-0">
            <div className="flex gap-6 items-center">
              <Link to="/projects" className="px-8 py-4 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300">
                VIEW PROJECTS
              </Link>
              
              {(profile.email || profile.phone || profile.linkedin) && (
                <div className="relative py-2 group contacts-dropdown">
                  <button 
                    onClick={() => setIsContactsOpen(!isContactsOpen)}
                    className="text-xs tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors flex items-center gap-2"
                  >
                    CONTACTS <span className="text-[8px]">▼</span>
                  </button>
                  
                  <div className={`absolute top-full right-0 md:right-auto md:left-0 pt-4 z-[999] transition-all duration-300 md:group-hover:opacity-100 md:group-hover:visible md:group-hover:translate-y-0 ${isContactsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                    <div className="bg-zinc-900/70 backdrop-blur-2xl border border-zinc-700 p-6 flex flex-col gap-6 min-w-[260px] md:min-w-[280px] shadow-2xl rounded-sm will-change-transform">
                      
                      {profile.email && (
                        <div className="flex justify-between items-center gap-6 border-b border-zinc-800/50 pb-4">
                          <span className="text-[10px] text-zinc-500 uppercase">Email</span>
                          <div className="flex items-center gap-4">
                            <a href={`mailto:${profile.email}`} className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors py-1">OPEN ↗</a>
                            <button onClick={() => handleCopy(profile.email)} className="text-zinc-400 hover:text-white transition-colors py-1" title="Copy Email">
                              {copiedItem === profile.email ? <CheckIcon /> : <CopyIcon />}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {profile.phone && (
                        <div className="flex justify-between items-center gap-6 border-b border-zinc-800/50 pb-4">
                          <span className="text-[10px] text-zinc-500 uppercase">Phone</span>
                          <div className="flex items-center gap-4">
                            <a href={`tel:${profile.phone}`} className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors py-1">CALL ↗</a>
                            <button onClick={() => handleCopy(profile.phone)} className="text-zinc-400 hover:text-white transition-colors py-1" title="Copy Phone">
                              {copiedItem === profile.phone ? <CheckIcon /> : <CopyIcon />}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {profile.linkedin && (
                        <div className="flex justify-between items-center gap-6">
                          <span className="text-[10px] text-zinc-500 uppercase">LinkedIn</span>
                          <div className="flex items-center gap-4">
                            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-xs tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors py-1">
                              CONNECT ↗
                            </a>
                            <button onClick={() => handleCopy(profile.linkedin)} className="text-zinc-400 hover:text-white transition-colors py-1" title="Copy Link">
                              {copiedItem === profile.linkedin ? <CheckIcon /> : <CopyIcon />}
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {active && (
        <div className="max-w-5xl mx-auto px-6 mt-12 md:mt-24">
          <h3 className="text-zinc-500 text-xs tracking-[0.2em] uppercase mb-12 text-center">Featured Work</h3>
          <AnimatePresence mode="wait">
            <m.div 
              key={active.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              whileHover={{ scale: 1.01 }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="relative border border-zinc-800/50 bg-zinc-950/40 backdrop-blur-xl p-12 min-h-[400px] flex flex-col justify-end overflow-hidden group shadow-2xl will-change-transform"
            >
              
              {active.in_development && (
                <div className="absolute top-8 right-8 z-20 inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-amber-500/30 bg-amber-950/40 backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                  <span className="text-[8px] text-amber-400 tracking-[0.3em] uppercase font-mono mt-[1px]">Active Development</span>
                </div>
              )}

              {active.image && (
                <img 
                  src={active.image} 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-700 mix-blend-overlay" 
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
            </m.div>
          </AnimatePresence>
          <div className="text-center mt-12">
            <Link to="/projects" className="text-zinc-400 text-xs tracking-[0.2em] uppercase hover:text-white border-b border-zinc-700 pb-1 transition-colors">View More Projects</Link>
          </div>
        </div>
      )}

      <div className="w-full py-12 border-y border-zinc-900/50 overflow-hidden mt-24 bg-zinc-950/20 backdrop-blur-sm relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent to-[#030303] z-10 hidden"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-transparent to-[#030303] z-10 hidden"></div>
        <m.div className="flex gap-12 will-change-transform" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          {[...skills, ...skills, ...skills].map((s, i) => (
            <span key={i} className="text-zinc-600 tracking-[0.3em] uppercase text-sm whitespace-nowrap">
              <span className="text-zinc-800 mr-3">/</span> {s.name}
            </span>
          ))}
        </m.div>
      </div>

      <AnimatePresence>
        {isImageOpen && (
          <m.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 cursor-pointer" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsImageOpen(false)}
          >
            <m.img 
              src={profile.photo} 
              className="max-h-full max-w-full object-contain shadow-2xl" 
              layoutId="profile-img" 
              alt="Profile Full Screen"
            />
            <button 
              className="absolute top-8 right-8 text-white tracking-widest uppercase text-xs hover:text-zinc-400 transition-colors"
              onClick={() => setIsImageOpen(false)}
            >
              CLOSE ✕
            </button>
          </m.div>
        )}
      </AnimatePresence>

    </div>
  );
}