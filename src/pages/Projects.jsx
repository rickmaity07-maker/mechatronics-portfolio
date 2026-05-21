import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard'; 

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('Projects')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setProjects(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm animate-pulse">
        Loading Database...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto z-10 relative mt-8 pb-32">
      
      {/* Page Header */}
      <div className="mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-light text-white mb-4 tracking-tight"
        >
          Selected Works
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
          className="text-zinc-400 max-w-xl font-light"
        >
          An archive of engineering projects, mechanical designs, and software development, pulled directly from my live database.
        </motion.p>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-zinc-500 text-sm tracking-widest uppercase py-12 border-y border-zinc-900 text-center">
          No projects found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      )}
      
    </div>
  );
}