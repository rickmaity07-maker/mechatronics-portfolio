import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function Skills() {
  const [skillsData, setSkillsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      // THE FIX: Reverted to only fetching the Skills table for faster load times
      const { data, error } = await supabase.from('Skills').select('*');

      if (!error && data) {
        // Group the flat database rows into categories automatically
        const grouped = data.reduce((acc, skill) => {
          const category = skill.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(skill.name);
          return acc;
        }, {});
        
        setSkillsData(grouped);
      }
      setIsLoading(false);
    };

    fetchSkills();
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