import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProjectCard({ project }) {
  // 1. We create a state to track if the user is on a mobile device
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // 2. This checks if the device lacks a traditional mouse (i.e., a phone/tablet)
    const checkDevice = () => {
      setIsTouchDevice(window.matchMedia('(hover: none)').matches);
    };
    
    checkDevice();
    
    // Listen for screen changes just in case they resize a browser window
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return (
    <Link to={project.link || `/projects/${project.id}`} state={project} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm">
      <div className="border border-zinc-800/50 bg-zinc-950/50 overflow-hidden h-full flex flex-col hover:border-zinc-600 transition-colors">
        
        {/* Card Image */}
        <div className="aspect-[4/3] overflow-hidden bg-[#0a0a0a] relative border-b border-zinc-800/50">
          {project.image ? (
            <motion.img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover"
              initial={{ filter: 'grayscale(100%)', opacity: 0.7, scale: 1 }}
              
              // --- THE FIX ---
              // If it's a desktop (!isTouchDevice), use the hover animation.
              // If it's a mobile phone (isTouchDevice), use the scroll animation.
              whileHover={!isTouchDevice ? { filter: 'grayscale(0%)', opacity: 1, scale: 1.05 } : {}}
              whileInView={isTouchDevice ? { filter: 'grayscale(0%)', opacity: 1, scale: 1.05 } : {}}
              
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