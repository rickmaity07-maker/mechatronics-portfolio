import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsData } from '../data/projects';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const project = projectsData.find(p => p.id === projectId);

  if (!project) {
    return <div className="text-white">Project not found.</div>;
  }

  return (
    <div className="animate-fade-in-up space-y-8 max-w-4xl mx-auto">
      <Link to="/projects" className="text-zinc-500 hover:text-white text-sm tracking-wider uppercase flex items-center gap-2">
        ← Back to Projects
      </Link>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">{project.title}</h1>
        <div className="flex gap-2">
          {project.tags.map(tag => (
             <span key={tag} className="text-xs uppercase tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300">
               {tag}
             </span>
          ))}
        </div>
      </div>

      <div className="aspect-video w-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <span className="text-zinc-600 tracking-widest">[ HIGH-RES CAD / PROJECT IMAGE ]</span>
      </div>

      <div className="prose prose-invert max-w-none text-zinc-400">
        <p className="text-lg leading-relaxed">{project.shortDescription}</p>
        {/* We will add more detailed case study content here later */}
      </div>
    </div>
  );
}