import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function Skills() {
  const [skillsData, setSkillsData] = useState({});
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      // THE FIX: Fetch both Skills and Profile data simultaneously
      const [skillsRes, profileRes] = await Promise.all([
        supabase.from('Skills').select('*'),
        supabase.from('Profile').select('*').limit(1)
      ]);

      if (!skillsRes.error && skillsRes.data) {
        // Group the flat database rows into categories automatically
        const grouped = skillsRes.data.reduce((acc, skill) => {
          const category = skill.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(skill.name);
          return acc;
        }, {});
        
        setSkillsData(grouped);
      }

      if (!profileRes.error && profileRes.data) {
        setProfile(profileRes.data[0]);
      }

      setIsLoading(false);
    };

    fetchPageData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm animate-pulse">
        Loading Database...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto z-10 relative">
      
      {/* --- IN DEVELOPMENT BANNER --- */}
      {profile?.in_development && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-amber-950/20 border-b border-amber-900/40 py-4 px-6 flex items-center justify-center gap-4 backdrop-blur-md mb-12 rounded-sm shadow-[0_0_15px_rgba(251,191,36,0.05)]"
        >
          <svg className="w-4 h-4 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span className="text-[10px] text-amber-500/90 tracking-[0.2em] uppercase font-mono mt-[1px]">
            System Notice: This data section is currently under active development.
          </span>
        </motion.div>
      )}

      {/* Page Header */}
      <div className="mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-light text-white mb-4"
        >
          Technical Capabilities
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-px w-16 bg-zinc-700 mb-6 origin-left"
        ></motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-zinc-400 max-w-xl"
        >
          A comprehensive breakdown of hardware, software, and engineering tools utilized across my projects.
        </motion.p>
      </div>

      {/* Dynamic Grid Layout */}
      {Object.keys(skillsData).length === 0 ? (
        <p className="text-zinc-500 font-light">No skills found in database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.keys(skillsData).map((category, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="border border-zinc-800/50 bg-zinc-950/50 p-8 hover:border-zinc-700 transition-colors group"
            >
              <h3 className="text-xs text-zinc-500 tracking-[0.2em] uppercase mb-8 group-hover:text-zinc-400 transition-colors">
                {category}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                {skillsData[category].map((skillName, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className="flex items-center gap-2 text-sm font-light text-zinc-400 px-4 py-2 border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 transition-all cursor-default"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
    </div>
  );
}