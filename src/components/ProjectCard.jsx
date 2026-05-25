import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProjectCard({ project }) {
  return (
    // THE FIX: Added state={project} to pass the database info to the next page
    // Fallback added to the 'to' link just in case project.link is undefined
    <Link to={project.link || `/projects/${project.id}`} state={project} className="group block h-full">
      <div className="border border-zinc-800/50 bg-zinc-950/50 overflow-hidden h-full flex flex-col hover:border-zinc-600 transition-colors">
        
        {/* Card Image */}
        <div className="aspect-[4/3] overflow-hidden bg-[#0a0a0a] relative border-b border-zinc-800/50">
          {project.image ? (
            // THE FIX: Upgraded to motion.img for mobile scroll intersection
            <motion.img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              // Desktop hover & Mobile scroll physics
              initial={{ filter: 'grayscale(100%)', opacity: 0.7, scale: 1 }}
              whileHover={{ filter: 'grayscale(0%)', opacity: 1, scale: 1.05 }}
              whileInView={{ filter: 'grayscale(0%)', opacity: 1, scale: 1.05 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 font-mono text-xs">
              NO ASSET
            </div>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-xl font-light text-white mb-4 group-hover:text-zinc-300 transition-colors">
            {project.title}
          </h3>
          
          {/* --- THE CRITICAL DATA SPLIT --- */}
          {/* Uses short preview text, falls back to old long text, limits to 3 lines */}
          <p className="text-sm text-zinc-400 font-light leading-relaxed line-clamp-3">
            {project.short_desc || project.desc}
          </p>
          
          {/* View Details CTA */}
          <div className="mt-auto pt-8 flex items-center text-[10px] tracking-widest uppercase text-zinc-500 group-hover:text-white transition-colors">
            View Documentation
            <svg className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </div>
        
      </div>
    </Link>
  );
}