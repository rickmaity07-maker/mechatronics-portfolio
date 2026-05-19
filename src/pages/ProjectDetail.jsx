import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProjectDetail() {
  const { projectId } = useParams();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // FETCH FROM SUPABASE INSTEAD OF LOCAL FILE
  useEffect(() => {
    async function fetchProject() {
      // We look for the exact routing link you typed in the Admin portal
      const targetLink = `/projects/${projectId}`;
      
      const { data, error } = await supabase
        .from('Projects')
        .select('*')
        .eq('link', targetLink)
        .single();

      if (error) {
        console.error("Error fetching project:", error);
      }
      
      if (data) {
        setProject(data);
      }
      setLoading(false);
    }
    
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-zinc-500 tracking-widest uppercase">Loading Project...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <p className="text-zinc-500 font-light">Project not found in the database.</p>
        <Link to="/projects" className="px-6 py-2 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
          RETURN TO PROJECTS
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'specs', label: 'Technical Specs' },
    { id: 'gallery', label: 'Gallery' }
  ];

  return (
    <div className="animate-fade-in-up space-y-8 max-w-4xl mx-auto">
      {/* HEADER SECTION */}
      <Link to="/projects" className="text-zinc-500 hover:text-white text-sm tracking-wider uppercase flex items-center gap-2 mb-4 inline-flex">
        ← Back to Projects
      </Link>
      
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-light text-white tracking-tight">{project.title}</h1>
        {/* Placeholder for tags if you add a tags column to Supabase later */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs uppercase tracking-wider px-2 py-1 bg-zinc-800 text-zinc-300">Engineering</span>
        </div>
      </div>

      {/* MAIN HERO IMAGE */}
      <div className="aspect-video w-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8">
        <span className="text-zinc-600 tracking-widest">[ HIGH-RES CAD / PROJECT IMAGE ]</span>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex space-x-8 border-b border-zinc-800/50 mt-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm tracking-widest uppercase transition-all duration-300 ${
              activeTab === tab.id 
                ? 'text-white border-b-2 border-white' 
                : 'text-zinc-600 hover:text-zinc-400 border-b-2 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS CONTENT AREA */}
      <div className="min-h-[30vh] pt-6 pb-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up prose prose-invert max-w-none text-zinc-400">
            <p className="text-lg leading-relaxed">{project.desc}</p>
          </div>
        )}

        {/* SPECS TAB */}
        {activeTab === 'specs' && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-zinc-800/50 bg-zinc-900/30 p-8">
              <div>
                <span className="block text-xs text-zinc-500 tracking-widest uppercase mb-1">Status</span>
                <span className="text-zinc-300 font-light">Live from Database</span>
              </div>
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="animate-fade-in-up grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <span className="text-xs tracking-widest uppercase">Gallery Image 1</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}