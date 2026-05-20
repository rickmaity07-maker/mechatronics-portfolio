import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import ProjectCard from '../components/ProjectCard'; // Import your new card

export default function AllProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('Projects').select('*').order('id', { ascending: false });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 z-10 relative">
      <h1 className="text-4xl font-light text-white mb-12 tracking-tight">All Engineering Projects</h1>
      
      <div className="grid grid-cols-1 gap-12">
        {/* We just loop through the database and let the component do the heavy lifting! */}
        {projects.map((proj) => (
          <ProjectCard key={proj.id} project={proj} animateIn={true} />
        ))}
      </div>
    </div>
  );
}
