import React from 'react';
import { Link } from 'react-router-dom';
import { projectsData } from '../data/projects'; // This imports the data you created in Step 1

export default function Projects() {
  return (
    <div className="animate-fade-in-up space-y-12">
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Engineering & Design</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`}
            className="group block p-6 bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-500 transition-colors"
          >
            <div className="aspect-video bg-zinc-950 mb-6 flex items-center justify-center border border-zinc-800/50">
               <span className="text-zinc-700 text-xs tracking-widest uppercase">Project</span>
            </div>
            <h3 className="text-xl text-white mb-2">{project.title}</h3>
            <p className="text-zinc-500 text-sm mb-6">{project.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}