import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import ExpandableImage from '../components/ExpandableImage';

export default function ProjectDetail() {
  const { projectId } = useParams(); 
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      // Reconstruct the link format we saved in the database
      const searchLink = `/projects/${projectId}`;
      
      const { data, error } = await supabase
        .from('Projects')
        .select('*')
        .eq('link', searchLink)
        .single(); // We only want one exact match

      if (!error && data) {
        setProject(data);
      }
      setIsLoading(false);
    };

    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm animate-pulse">
        Loading Project Data...
      </div>
    );
  }

  if (!project) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-32 text-center space-y-6">
        <h1 className="text-3xl text-white font-light">Project Not Found</h1>
        <p className="text-zinc-500">This project might have been removed from the database.</p>
        <Link to="/projects" className="inline-block px-8 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors uppercase tracking-widest text-xs">
          Return to Projects
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto z-10 relative mt-8 pb-24">
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <Link to="/projects" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center w-max">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Works
        </Link>
      </motion.div>

      <div className="space-y-16">
        
        {/* Title & Divider */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light tracking-tight text-white mb-6"
          >
            {project.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-px w-24 bg-zinc-700 origin-left"
          ></motion.div>
        </div>

        {/* Hero Image (using the ExpandableImage component) */}
        {project.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <ExpandableImage
              src={project.image}
              alt={project.title}
              // Using an ultra-wide cinematic aspect ratio for project banners
              className="w-full aspect-video md:aspect-[21/9] object-cover border border-zinc-800/50"
              layoutId={`project-img-${project.id}`}
            />
          </motion.div>
        )}

        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl"
        >
          <p className="text-zinc-400 font-light leading-relaxed text-lg whitespace-pre-wrap">
            {project.desc}
          </p>
        </motion.div>

      </div>
    </div>
  );
}