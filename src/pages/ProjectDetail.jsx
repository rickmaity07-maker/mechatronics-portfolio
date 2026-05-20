import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

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
    return <div className="animate-pulse text-zinc-500 tracking-widest uppercase text-sm mt-32">Loading Project Data...</div>;
  }

  if (!project) {
    return (
      <div className="mt-32 text-center space-y-6 animate-fade-in-up">
        <h1 className="text-3xl text-white font-light">Project Not Found</h1>
        <p className="text-zinc-500">This project might have been removed from the database.</p>
        <Link to="/projects" className="inline-block px-6 py-2 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mt-12 max-w-4xl space-y-12">
      <Link to="/projects" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Works
      </Link>

      <div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6">{project.title}</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      <div className="prose prose-invert max-w-none">
        <p className="text-zinc-400 font-light leading-relaxed text-lg whitespace-pre-wrap">
          {project.desc}
        </p>
      </div>
    </div>
  );
}