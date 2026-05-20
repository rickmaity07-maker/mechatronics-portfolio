import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Home() {
  const [data, setData] = useState({ profile: null, projects: [], skills: [] });
  const [isLoading, setIsLoading] = useState(true);
  
  // State to track which project is showing in the carousel
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  
  // NEW: State for copy-to-clipboard visual feedback
  const [copiedItem, setCopiedItem] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      const [profileRes, projectsRes, skillsRes] = await Promise.all([
        supabase.from('Profile').select('*').limit(1),
        supabase.from('Projects').select('*').order('id', { ascending: false }),
        supabase.from('Skills').select('*')
      ]);

      setData({
        profile: profileRes.data?.[0] || null,
        projects: projectsRes.data || [],
        skills: skillsRes.data || []
      });
      setIsLoading(false);
    };

    fetchHomeData();
  }, []);

  // --- CAROUSEL NAVIGATION CONTROLS ---
  const handleNextProject = () => {
    setCurrentProjectIndex((prev) => 
      prev === data.projects.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevProject = () => {
    setCurrentProjectIndex((prev) => 
      prev === 0 ? data.projects.length - 1 : prev - 1
    );
  };

  // --- NEW: COPY TO CLIPBOARD FUNCTION ---
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(text);
    // Remove the checkmark after 2 seconds
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (isLoading) return <div className="animate-pulse text-zinc-500 tracking-widest uppercase text-sm mt-32 px-6 max-w-5xl mx-auto">Loading Interface...</div>;
  if (!data.profile) return <div className="text-zinc-500 mt-32 tracking-widest uppercase text-sm px-6 max-w-5xl mx-auto">No profile data found.</div>;

  const { profile, projects, skills } = data;
  const doubledSkills = [...skills, ...skills, ...skills]; // Tripled to ensure it perfectly wraps large screens

  // Get the single active project based on the carousel index
  const activeProject = projects[currentProjectIndex];

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="animate-fade-in-up pb-12">
        
        {/* --- 1. HERO SECTION (Split Screen) --- */}
        <div className="min-h-[75vh] md:min-h-[85vh] flex items-center px-6 max-w-6xl mx-auto pt-12 md:pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 w-full items-center">
            <div>
              <h2 className="text-zinc-500 tracking-[0.15em] text-xs uppercase font-semibold mb-4">
                {profile.role}
              </h2>
              <h1 className="text-5xl md:text-7xl font-light text-white mb-6">
                {profile.name}
              </h1>
              <div className="h-px w-16 bg-zinc-800 mb-8"></div>
              <p className="text-zinc-400 leading-relaxed font-light mb-12 max-w-md whitespace-pre-wrap">
                {profile.bio}
              </p>
              
              <div className="flex flex-wrap gap-8 items-center">
                <Link to="/projects" className="px-6 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors">
                  VIEW PROJECTS
                </Link>
                
                {/* UPGRADED HOVER CONTACTS MENU WITH COPY FEATURES */}
                {(profile.email || profile.phone || profile.linkedin) && (
                  <div className="relative group py-2">
                    <button className="text-xs tracking-[0.2em] uppercase text-zinc-500 group-hover:text-white transition-colors flex items-center gap-2">
                      CONTACTS <span className="text-lg leading-none transform transition-transform duration-300 group-hover:rotate-180">&darr;</span>
                    </button>
                    
                    {/* Dropdown Box */}
                    <div className="absolute top-full left-0 md:left-auto md:right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col gap-6 min-w-[260px] shadow-2xl">
                        
                        {profile.email && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-zinc-600 tracking-widest uppercase">Email</span>
                            <div className="flex items-center justify-between gap-4">
                              <a href={`mailto:${profile.email}`} className="text-xs text-zinc-300 hover:text-white transition-colors truncate">
                                {profile.email}
                              </a>
                              <button onClick={() => handleCopy(profile.email)} className="text-zinc-500 hover:text-white transition-colors" title="Copy Email">
                                {copiedItem === profile.email ? (
                                  <span className="text-emerald-500 text-xs font-bold">✓</span>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {profile.phone && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-zinc-600 tracking-widest uppercase">Phone</span>
                            <div className="flex items-center justify-between gap-4">
                              <a href={`tel:${profile.phone}`} className="text-xs text-zinc-300 hover:text-white transition-colors truncate">
                                {profile.phone}
                              </a>
                              <button onClick={() => handleCopy(profile.phone)} className="text-zinc-500 hover:text-white transition-colors" title="Copy Phone">
                                {copiedItem === profile.phone ? (
                                  <span className="text-emerald-500 text-xs font-bold">✓</span>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {profile.linkedin && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[9px] text-zinc-600 tracking-widest uppercase">LinkedIn</span>
                            <div className="flex items-center justify-between gap-4">
                              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-xs text-zinc-300 hover:text-white transition-colors truncate">
                                {/* Strips "https://www." to make the URL look cleaner in the box */}
                                {profile.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                              </a>
                              <button onClick={() => handleCopy(profile.linkedin)} className="text-zinc-500 hover:text-white transition-colors" title="Copy URL">
                                {copiedItem === profile.linkedin ? (
                                  <span className="text-emerald-500 text-xs font-bold">✓</span>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
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

            {profile.photo && (
              <div className="w-full flex md:justify-end">
                <img 
                  src={profile.photo} 
                  alt={profile.name} 
                  className="w-full md:w-[400px] aspect-[4/5] object-cover border border-zinc-800/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* --- 2. FEATURED PROJECTS (Single-Item Carousel with Image) --- */}
        {projects.length > 0 && (
          <div className="max-w-5xl mx-auto px-6 mt-12 md:mt-24">
            
            {/* Header & Arrows */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-light text-white tracking-tight">Featured Projects</h3>
                <p className="text-zinc-500 text-xs tracking-widest uppercase mt-2">Live from the database</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevProject} 
                  className="w-10 h-10 flex items-center justify-center border border-zinc-800 bg-zinc-950/50 text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors z-10"
                >
                  &larr;
                </button>
                <button 
                  onClick={handleNextProject} 
                  className="w-10 h-10 flex items-center justify-center border border-zinc-800 bg-zinc-950/50 text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors z-10"
                >
                  &rarr;
                </button>
              </div>
            </div>

            {/* Active Project Card (Upgraded with Background Image) */}
            <div className="border border-zinc-800/50 bg-zinc-950/50 flex flex-col justify-between items-start transition-all overflow-hidden relative min-h-[400px]">
              
              {/* The Background Image */}
              {activeProject.image && (
                <div className="absolute inset-0 w-full h-full">
                  <img 
                    src={activeProject.image} 
                    alt={activeProject.title} 
                    className="w-full h-full object-cover opacity-30 hover:opacity-50 transition-opacity duration-500" 
                  />
                  {/* Dark gradient overlay so text remains readable */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
                </div>
              )}

              {/* The Content (Sits on top of the image) */}
              <div className="relative z-10 w-full h-full p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-auto">
                <div className="max-w-2xl">
                  <h4 className="text-3xl md:text-4xl font-light text-white mb-4 drop-shadow-lg">{activeProject.title}</h4>
                  <p className="text-zinc-300 font-light leading-relaxed line-clamp-3 drop-shadow-md">{activeProject.desc}</p>
                </div>
                <Link 
                  to={activeProject.link} 
                  className="shrink-0 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all whitespace-nowrap"
                >
                  VIEW DETAILS
                </Link>
              </div>
            </div>

            {/* View All Button */}
            <div className="mt-8 text-center md:text-left flex justify-center">
              <Link 
                to="/projects" 
                className="inline-block px-8 py-3 border border-zinc-800 text-xs font-semibold tracking-widest uppercase text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
              >
                VIEW ALL PROJECTS
              </Link>
            </div>
          </div>
        )}

        {/* --- 3. CORE COMPETENCIES (Dot-Separated Marquee) --- */}
        <div className="mt-32 pt-16 pb-12 border-t border-zinc-800/30 text-center overflow-hidden">
          <h3 className="text-2xl font-light text-white tracking-tight mb-2">Core Competencies</h3>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-12">Hardware, software, and tools</p>

          <div className="w-full relative bg-zinc-950/30 border-y border-zinc-800/30 py-6">
            <div className="animate-marquee items-center">
              {doubledSkills.map((skill, index) => (
                <React.Fragment key={index}>
                  <span className="text-zinc-400 tracking-widest uppercase text-xs md:text-sm px-6 md:px-10">
                    {skill.name}
                  </span>
                  <span className="text-zinc-700 text-xs">&bull;</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}