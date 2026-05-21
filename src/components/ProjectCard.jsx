import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <Link to={project.link} className="group block h-full">
      <div className="border border-zinc-800/50 bg-zinc-950/50 overflow-hidden h-full flex flex-col hover:border-zinc-600 transition-colors">
        
        {/* Card Image */}
        <div className="aspect-[4/3] overflow-hidden bg-[#0a0a0a] relative border-b border-zinc-800/50">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
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