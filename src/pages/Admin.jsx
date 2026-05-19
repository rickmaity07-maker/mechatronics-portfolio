import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Admin() {
  // 1. SECURITY STATE: Check browser memory on load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('rm_owner') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  
  // Database States
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState(null);

  const SECRET_PASSWORD = 'rick'; 

  // 2. HANDLE LOGIN & HAND OUT VIP PASS
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      localStorage.setItem('rm_owner', 'true'); // Save VIP pass
      setIsAuthenticated(true);
      window.location.reload(); // Refresh to update the Navbar
    } else {
      alert('Incorrect Password');
    }
  };

  // 3. HANDLE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('rm_owner'); // Destroy VIP pass
    window.location.reload(); // Refresh to hide the Navbar link
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from('Projects').select('*');
    if (data) setProjects(data);
  };

  useEffect(() => {
    if (isAuthenticated) fetchProjects();
  }, [isAuthenticated]);

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
      fetchProjects();
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${title}?`);
    if (!confirmDelete) return;

    const { error } = await supabase.from('Projects').delete().eq('id', id);
    
    if (error) alert("Error deleting project.");
    else fetchProjects();
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
          <button type="submit" className="w-full px-6 py-2 bg-white text-black text-sm tracking-wider uppercase font-bold hover:bg-zinc-200 transition-colors">
            Access Portal
          </button>
        </form>
      </div>
    );
  }

  // --- RENDER ADMIN DASHBOARD ---
  return (
    <div className="min-h-[80vh] py-12 animate-fade-in-up max-w-4xl mx-auto">
      
      {/* Dashboard Header with Logout */}
      <div className="flex justify-between items-end mb-12 border-b border-zinc-800/50 pb-4">
        <div>
          <h2 className="text-zinc-500 tracking-[0.2em] text-xs uppercase mb-2">Internal System</h2>
          <h1 className="text-3xl font-light text-white tracking-tight">Database Management</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors"
        >
          Lock Portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT SIDE: ADD NEW PROJECT */}
        <div className="border border-zinc-800/50 bg-zinc-950/50 p-8 h-fit">
          <h2 className="text-2xl font-light text-white tracking-tight mb-8">Add New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 tracking-widest uppercase">Project Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white focus:outline-none focus:border-zinc-500" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 tracking-widest uppercase">Description</label>
              <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} rows="3" className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white resize-none focus:outline-none focus:border-zinc-500" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 tracking-widest uppercase">Routing Link</label>
              <input type="text" required value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-white focus:outline-none focus:border-zinc-500" placeholder="/projects/my-project" />
            </div>
            
            <div className="pt-2 flex items-center justify-between">
              <button type="submit" disabled={status === 'loading'} className="px-8 py-3 bg-white text-black text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-colors disabled:opacity-50">
                {status === 'loading' ? 'SAVING...' : 'PUBLISH'}
              </button>
              {status === 'success' && <span className="text-sm tracking-wide text-green-500 font-light">Saved!</span>}
              {status === 'error' && <span className="text-sm tracking-wide text-red-500 font-light">Error!</span>}
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: MANAGE EXISTING PROJECTS */}
        <div className="border border-zinc-800/50 bg-zinc-950/50 p-8 h-fit">
          <h2 className="text-2xl font-light text-white tracking-tight mb-8">Current Database</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {projects.map((proj) => (
              <div key={proj.id} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800">
                <span className="text-white font-light truncate mr-4">{proj.title}</span>
                <button 
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="text-xs tracking-widest uppercase text-red-500 hover:text-red-400 border border-red-900 hover:bg-red-950/30 px-3 py-1 transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
            {projects.length === 0 && <p className="text-zinc-500 text-sm font-light">No projects found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}