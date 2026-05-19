import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Connected to the live database!

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH PROJECTS FROM SUPABASE
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('Projects').select('*');
      if (error) {
        console.error("Error fetching projects:", error);
      }
      if (data) {
        setProjects(data);
      }
      setLoading(false);
    }
    
    fetchProjects();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-12">
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Engineering & Design</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      {loading ? (
        <div className="py-12 text-zinc-500 tracking-widest uppercase">
          Loading database...
        </div>
      ) : projects.length === 0 ? (
        <div className="py-12 text-zinc-500">
          No projects found. Add some in the Admin portal!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={project.link} // Routes exactly to the link you set in Admin!
              className="group block p-6 bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-500 transition-colors flex flex-col h-full"
            >
              <div className="aspect-video bg-zinc-950 mb-6 flex items-center justify-center border border-zinc-800/50">
                 <span className="text-zinc-700 text-xs tracking-widest uppercase">Project</span>
              </div>
              
              <h3 className="text-xl text-white mb-2">{project.title}</h3>
              
              {/* Uses the 'desc' column from Supabase, line-clamp keeps cards even */}
              <p className="text-zinc-500 text-sm mb-6 flex-grow line-clamp-3">
                {project.desc}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {/* Fallback tag since we don't have a tags column in Supabase yet */}
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300">
                  Engineering
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}