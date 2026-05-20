import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';

export default function Experience() {
  const [experienceData, setExperienceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data, error } = await supabase
        .from('Experience')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setExperienceData(data);
      }
      setIsLoading(false);
    };

    fetchExperience();
  }, []);

  if (isLoading) {
    return (
      <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm animate-pulse">
        Loading History...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto z-10 relative">
      
      {/* Page Header */}
      <div className="mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-light text-white mb-4"
        >
          Professional Experience
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-px w-16 bg-zinc-700 mb-6 origin-left"
        ></motion.div>
      </div>

      {/* The Timeline Grid */}
      <div className="space-y-24">
        {experienceData.length === 0 ? (
          <p className="text-zinc-500 font-light">No experience history available.</p>
        ) : (
          experienceData.map((job, index) => (
            <motion.div 
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8 md:gap-16 group"
            >
              {/* Left Column: Dates & Company */}
              <div className="border-l border-zinc-800 pl-6 md:pl-0 md:border-l-0 md:text-right md:pr-12 md:border-r border-zinc-800/50 group-hover:border-zinc-500 transition-colors duration-500">
                <span className="text-zinc-500 text-xs tracking-[0.2em] uppercase block mb-2">{job.period}</span>
                <h3 className="text-xl text-white font-light">{job.company}</h3>
              </div>

              {/* Right Column: Role & Description */}
              <div>
                <h4 className="text-2xl text-zinc-300 font-light mb-6">{job.role}</h4>
                
                <div className="text-zinc-400 font-light leading-relaxed space-y-4 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}