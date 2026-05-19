import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Admin() {
  // Security State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Database States
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState(null);

  // 1. HARDCODED PASSWORD (Change 'admin123' to whatever you want)
  const SECRET_PASSWORD = 'rick'; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) setIsAuthenticated(true);
    else alert('Incorrect Password');
  };

  // 2. Fetch projects so we can list them for deletion
  const fetchProjects = async () => {
    const { data } = await supabase.from('Projects').select('*');
    if (data) setProjects(data);
  };

  useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

  // 3. Handle Adding a Project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('Projects').insert([{ title, desc, link }]);
    
    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setTitle(''); setDesc(''); setLink('');
      fetchProjects(); // Refresh the list!
      setTimeout(() => setStatus(null), 3000);
    }
  };

  // 4. Handle Deleting a Project
  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${title}?`);
    if (!confirmDelete) return;

    const { error } = await supabase.from('Projects').delete().eq('id', id);
    
    if (error) alert("Error deleting project.");
    else fetchProjects(); // Refresh the list!
  };

  // --- RENDER LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center animate-fade-in-up">
        <form onSubmit={handleLogin} className="p-8 border border-zinc-800 bg-zinc-950/50 space-y-4 text-center">
          <h2 className="text-white text-xl font-light tracking-widest uppercase mb-6">Restricted Area</h2>
          <input 
            type="password" 
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white text-center focus:outline-none focus:border-zinc-500"
            placeholder="Enter Admin Password"
          />
          <button type="submit" className="w-full px-6 py-2 bg-white text-black text-sm tracking-wider uppercase font-bold hover:bg-zinc-200">
            Access Portal
          </button>
        </form>
      </div>
    );
  }

  // --- RENDER ADMIN DASHBOARD ---
  return (
    <div className="min-h-[80vh] py-12 animate-fade-in-up max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
      
      {/* LEFT SIDE: ADD NEW PROJECT */}
      <div className="border border-zinc-800/50 bg-zinc-950/50 p-8 h-fit">
        <h2 className="text-2xl font-light text-white tracking-tight mb-8">Add New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 tracking-widest uppercase">Project Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 tracking-widest uppercase">Description</label>
            <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} rows="3" className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 tracking-widest uppercase">Routing Link</label>
            <input type="text" required value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white" placeholder="/projects/my-project" />
          </div>
          <button type="submit" className="w-full px-8 py-3 bg-white text-black text-sm font-semibold tracking-wide hover:bg-zinc-200">
            {status === 'loading' ? 'SAVING...' : 'PUBLISH PROJECT'}
          </button>
        </form>
      </div>

      {/* RIGHT SIDE: MANAGE EXISTING PROJECTS */}
      <div className="border border-zinc-800/50 bg-zinc-950/50 p-8">
        <h2 className="text-2xl font-light text-white tracking-tight mb-8">Manage Database</h2>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {projects.map((proj) => (
            <div key={proj.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800">
              <span className="text-white font-light truncate mr-4">{proj.title}</span>
              <button 
                onClick={() => handleDelete(proj.id, proj.title)}
                className="text-xs tracking-widest uppercase text-red-500 hover:text-red-400 border border-red-900 hover:bg-red-950/30 px-3 py-1 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
          {projects.length === 0 && <p className="text-zinc-500 text-sm">No projects to manage.</p>}
        </div>
      </div>

    </div>
  );
}