import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      // PERFORMANCE OVERRIDE: Check Session Cache First
      const cachedProjects = sessionStorage.getItem('kern_projects_data');
      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));
        setIsLoading(false);
        return;
      }

      // If no cache, hit the database
      const { data, error } = await supabase
        .from('Projects')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        sessionStorage.setItem('kern_projects_data', JSON.stringify(data));
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
      <div className="mb-16 px-6 md:px-0">
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
        <div className="text-zinc-500 text-sm tracking-widest uppercase py-12 border-y border-zinc-900 text-center mx-6 md:mx-0">
          No projects found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-0">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
              className="h-full"
            >
              <Link to={`/projects/${project.id}`} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm">
                <motion.div 
                  className="relative border border-zinc-800/50 bg-zinc-950/40 backdrop-blur-xl p-8 min-h-[350px] flex flex-col justify-end overflow-hidden shadow-xl h-full rounded-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                >
                  
                  {project.in_development && (
                    <div className="absolute top-6 right-6 z-20 inline-flex items-center gap-2 px-2 py-1 rounded-sm border border-amber-500/30 bg-amber-950/40 backdrop-blur-md">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                      </span>
                      <span className="text-[7px] text-amber-400 tracking-[0.3em] uppercase font-mono mt-[1px]">In Dev</span>
                    </div>
                  )}

                  {project.image && (
                    <motion.img 
                      src={project.image} 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" 
                      alt={`Visualization for ${project.title}`}
                      loading="lazy"
                      decoding="async"
                      // --- THE MOBILE FIX: Intersection Observer ---
                      initial={{ opacity: 0.1 }}
                      whileHover={{ opacity: 0.3 }}
                      whileInView={{ opacity: 0.3 }} // Triggers when scrolling on phone
                      viewport={{ once: false, amount: 0.4 }} // Activates when 40% of the image is on screen
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent"></div>
                  
                  <h3 className="text-2xl font-light text-white mb-2 relative z-10 drop-shadow-lg">{project.title}</h3>
                  <p className="text-zinc-400 text-sm relative z-10 line-clamp-2">{project.short_desc || project.desc}</p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      
    </div>
  );
}