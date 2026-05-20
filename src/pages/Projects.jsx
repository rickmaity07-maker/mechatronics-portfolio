import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Projects() {
  const [projectsData, setProjectsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('Projects')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setProjectsData(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-12 max-w-5xl">
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Selected Works</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-sm tracking-widest uppercase animate-pulse pt-4">
          Loading Database...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {projectsData.map((project) => (
            <Link 
              key={project.id} 
              to={project.link}
              className="group block border border-zinc-800/50 bg-zinc-950/50 p-8 hover:border-zinc-500 transition-colors"
            >
              <h3 className="text-2xl font-light text-white mb-3 group-hover:text-zinc-300 transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-500 font-light text-sm leading-relaxed mb-6 line-clamp-3">
                {project.desc}
              </p>
              <div className="flex items-center text-xs tracking-widest uppercase text-zinc-400 group-hover:text-white transition-colors">
                <span>View Details</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
          {projectsData.length === 0 && <p className="text-zinc-500 font-light">No projects available.</p>}
        </div>
      )}
    </div>
  );
}