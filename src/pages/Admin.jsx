import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: '', text: '' });

  const TABS = ['Profile', 'Education', 'Experience', 'Projects', 'Skills', 'Settings'];
  const [activeTab, setActiveTab] = useState('Profile');
  const [dbData, setDbData] = useState([]);
  const [status, setStatus] = useState(null);
  const [formData, setFormData] = useState({});
  
  const [isUploading, setIsUploading] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null); 
  const [imageZoom, setImageZoom] = useState(1);
  const [targetAspect, setTargetAspect] = useState('4/5'); 
  const [activeUploadField, setActiveUploadField] = useState(''); 
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) localStorage.setItem('rm_owner', 'true');
      else localStorage.removeItem('rm_owner');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: 'info', text: 'Authenticating...' });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMessage({ type: 'error', text: error.message });
    else setAuthMessage({ type: 'success', text: 'Welcome back.' });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setAuthMessage({ type: 'info', text: 'Sending reset link...' });
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/admin', 
    });
    if (error) setAuthMessage({ type: 'error', text: error.message });
    else setAuthMessage({ type: 'success', text: 'Reset link sent! Check your email.' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const fetchData = async () => {
    const tableToFetch = activeTab === 'Settings' ? 'Profile' : activeTab;
    const { data } = await supabase.from(tableToFetch).select('*').order('id', { ascending: false });
    if (data) setDbData(data);
  };

  useEffect(() => {
    if (session) {
      fetchData();
      setStatus(null);
    }
  }, [session, activeTab]);

  useEffect(() => {
    if ((activeTab === 'Profile' || activeTab === 'Settings') && dbData.length > 0) {
      setFormData(dbData[0]); 
    } else {
      setFormData({});
    }
  }, [dbData, activeTab]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleToggleSetting = async (field) => {
    if (!dbData || dbData.length === 0) return;
    const currentProfile = dbData[0];
    const newValue = !currentProfile[field];
    
    try {
      const { error } = await supabase
        .from('Profile')
        .update({ [field]: newValue })
        .eq('id', currentProfile.id);

      if (error) throw error;
      
      const updatedData = [...dbData];
      updatedData[0][field] = newValue;
      setDbData(updatedData);
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Failed to update setting. Check console.');
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setActiveUploadField(fieldName);
    setTargetAspect(fieldName === 'photo' ? '4/5' : '16/9');
    setImageZoom(1);

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!rawImageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = rawImageSrc;

    img.onload = () => {
      imageRef.current = img;
      
      let targetWidth = 800;
      let targetHeight = 1000; 

      if (targetAspect === '1/1') {
        targetHeight = 800;
      } else if (targetAspect === '16/9') {
        targetHeight = 450;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.clearRect(0, 0, targetWidth, targetHeight);

      const imgAspect = img.width / img.height;
      const canvasAspect = targetWidth / targetHeight;
      
      let renderWidth, renderHeight;

      if (imgAspect > canvasAspect) {
        renderHeight = targetHeight * imageZoom;
        renderWidth = (targetHeight * imgAspect) * imageZoom;
      } else {
        renderWidth = targetWidth * imageZoom;
        renderHeight = (targetWidth / imgAspect) * imageZoom;
      }

      const xOffset = (targetWidth - renderWidth) / 2;
      const yOffset = (targetHeight - renderHeight) / 2;

      ctx.drawImage(img, xOffset, yOffset, renderWidth, renderHeight);
    };
  }, [rawImageSrc, imageZoom, targetAspect]);

  const handleProcessedUpload = async () => {
    if (!canvasRef.current) return;
    setIsUploading(true);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        alert("Image processing failure.");
        setIsUploading(false);
        return;
      }

      const fileName = `${Math.random()}.jpg`;
      const filePath = `${activeTab.toLowerCase()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, blob, { contentType: 'image/jpeg' });

      if (uploadError) {
        alert('Upload blocked. Run the revised SQL storage policies in your dashboard.');
        console.error(uploadError);
        setIsUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, [activeUploadField]: data.publicUrl }));
      setRawImageSrc(null); 
      setIsUploading(false);
    }, 'image/jpeg', 0.9); 
  };

  const handleEdit = (item) => {
    let editData = { ...item };
    if ((activeTab === 'Education' || activeTab === 'Experience') && item.period) {
      const parts = item.period.split(' — ');
      if (parts.length === 2) {
        editData.startDate = parts[0];
        editData.endDate = parts[1];
      }
    }
    setFormData(editData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    let payload = { ...formData };
    let dbError;

    if ((activeTab === 'Education' || activeTab === 'Experience') && payload.startDate && payload.endDate) {
      payload.period = `${payload.startDate} — ${payload.endDate}`;
      delete payload.startDate; 
      delete payload.endDate;
    }

    if (payload.id) {
      const { error } = await supabase.from(activeTab).update(payload).eq('id', payload.id);
      dbError = error;
    } else {
      const { error } = await supabase.from(activeTab).insert([payload]);
      dbError = error;
    }

    if (dbError) {
      console.error(dbError);
      setStatus('error');
    } else {
      setStatus('success');
      if (activeTab !== 'Profile') setFormData({}); 
      fetchData();
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this entry?`)) return;
    const { error } = await supabase.from(activeTab).delete().eq('id', id);
    if (!error) fetchData();
  };

  const getDisplayTitle = (item) => {
    if (activeTab === 'Profile') return item.name;
    if (activeTab === 'Education') return item.institution;
    if (activeTab === 'Experience') return item.company;
    if (activeTab === 'Projects') return item.title;
    if (activeTab === 'Skills') return item.name;
    return 'Unknown Entry';
  };

  const getDisplaySubtitle = (item) => {
    if (activeTab === 'Profile') return item.role;
    if (activeTab === 'Education') return item.degree;
    if (activeTab === 'Experience') return item.role;
    if (activeTab === 'Projects') return item.link;
    if (activeTab === 'Skills') return item.category;
    return '';
  };

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 border border-zinc-800 bg-zinc-950/50 w-full max-w-md"
        >
          <h2 className="text-white text-xl font-light tracking-widest uppercase mb-6 text-center">System Access</h2>
          <form onSubmit={isResetMode ? handlePasswordReset : handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 tracking-widest uppercase mb-1 block">Username / Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" />
            </div>
            {!isResetMode && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-zinc-500 tracking-widest uppercase">Password</label>
                  <button type="button" onClick={() => setIsResetMode(true)} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-wider transition-colors">Forgot?</button>
                </div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" />
              </div>
            )}
            <button type="submit" className="w-full px-6 py-3 mt-4 bg-white text-black text-xs tracking-widest uppercase font-bold hover:bg-zinc-300 transition-colors">
              {isResetMode ? 'Send Reset Link' : 'Authenticate'}
            </button>
            {isResetMode && (
              <button type="button" onClick={() => setIsResetMode(false)} className="w-full text-xs text-zinc-500 hover:text-white uppercase tracking-widest mt-4 transition-colors">
                ← Back to Login
              </button>
            )}
            {authMessage.text && (
              <div className={`mt-4 text-xs tracking-wide text-center p-3 border ${authMessage.type === 'error' ? 'text-red-400 border-red-900/50 bg-red-950/20' : 'text-emerald-400 border-emerald-900/50 bg-emerald-950/20'}`}>
                {authMessage.text}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 max-w-5xl mx-auto px-4 z-10 relative">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-zinc-800/50 pb-4 gap-4 md:gap-0">
          <div>
            <h2 className="text-zinc-500 tracking-[0.2em] text-xs uppercase mb-2">Master Control</h2>
            <h1 className="text-3xl font-light text-white tracking-tight">System Database</h1>
          </div>
          <div className="text-left md:text-right">
            <p className="text-xs text-zinc-500 tracking-widest uppercase mb-2">Logged in as: {session.user.email}</p>
            <button onClick={handleLogout} className="text-xs font-bold tracking-widest uppercase text-red-500 hover:text-red-400 transition-colors">
              Terminate Session
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-800/30 pb-4">
          {TABS.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-5 py-2 text-xs tracking-widest uppercase transition-colors border ${activeTab === tab ? 'bg-white text-black border-white font-bold' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-white hover:border-zinc-600'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {rawImageSrc && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 p-6 border border-zinc-700 bg-zinc-900/50 overflow-hidden"
          >
            <h3 className="text-white tracking-widest text-sm uppercase mb-6">Image Manipulation Studio</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center border border-zinc-800 bg-black p-4 overflow-hidden">
                <canvas ref={canvasRef} className="max-w-full max-h-[350px] object-contain border border-zinc-700" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 uppercase tracking-widest">Aspect Ratio Preset</label>
                  <div className="flex flex-wrap gap-2">
                    {['4/5', '16/9', '1/1'].map((aspect) => (
                      <button type="button" key={aspect} onClick={() => setTargetAspect(aspect)} className={`px-3 py-1 text-xs border transition-colors ${targetAspect === aspect ? 'bg-white text-black font-bold' : 'text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'}`}>
                        {aspect === '4/5' ? 'Portrait (4:5)' : aspect === '16/9' ? 'Project (16:9)' : 'Square (1:1)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400 uppercase tracking-widest">
                    <span>Zoom Scale Range</span>
                    <span className="text-white font-mono">{imageZoom.toFixed(2)}x</span>
                  </div>
                  <input type="range" min="1" max="3" step="0.05" value={imageZoom} onChange={(e) => setImageZoom(parseFloat(e.target.value))} className="w-full accent-white bg-zinc-800 h-1 cursor-pointer" />
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button type="button" onClick={handleProcessedUpload} disabled={isUploading} className="px-6 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-300 transition-colors disabled:opacity-50">
                    {isUploading ? 'Compiling...' : 'Crop & Save Image'}
                  </button>
                  <button type="button" onClick={() => setRawImageSrc(null)} className="px-6 py-3 border border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`border border-zinc-800/50 bg-zinc-950/50 p-8 h-fit transition-all ${activeTab === 'Settings' ? 'lg:col-span-2 max-w-3xl mx-auto w-full' : ''}`}
        >
          <h2 className="text-2xl font-light text-white tracking-tight mb-8">
            {activeTab === 'Profile' ? 'Update Profile' : activeTab === 'Settings' ? 'Global Preferences' : formData.id ? `Edit ${activeTab} Entry` : `Add to ${activeTab}`}
          </h2>
          
          {activeTab === 'Settings' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between bg-zinc-900/50 p-6 border border-zinc-800 rounded-sm">
                <div>
                  <h4 className="text-white text-xs tracking-widest uppercase mb-2">Available for Opportunities</h4>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Displays a pulsing emerald badge on the Home profile.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggleSetting('available_to_work')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${dbData[0]?.available_to_work ? 'bg-emerald-500' : 'bg-zinc-800'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${dbData[0]?.available_to_work ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {activeTab === 'Profile' && (
                <>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Full Name</label><input type="text" required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Professional Role</label><input type="text" required name="role" value={formData.role || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 tracking-widest uppercase">Profile Portrait Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer w-full transition-colors" />
                    {formData.photo && (
                      <div className="mt-4 border border-zinc-800 p-2 inline-block bg-zinc-900/50">
                        <img src={formData.photo} alt="Current profile" className="h-24 w-24 object-cover" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Bio / About Me</label><textarea required name="bio" value={formData.bio || ''} onChange={handleInputChange} rows="4" className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white resize-none focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Email (Optional)</label><input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Phone Number (Optional)</label><input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="+1 (555) 123-4567" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">LinkedIn URL (Optional)</label><input type="text" name="linkedin" value={formData.linkedin || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                </>
              )}

              {activeTab === 'Projects' && (
                <>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Project Title</label><input type="text" required name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  
                  {/* --- NEW: IN DEVELOPMENT TOGGLE FOR PROJECTS --- */}
                  <div className="flex items-center justify-between bg-zinc-900/50 p-4 border border-zinc-800 rounded-sm">
                    <div>
                      <label className="text-xs text-white tracking-widest uppercase block mb-1">In Development</label>
                      <p className="text-[10px] text-zinc-500 uppercase">Mark this project as an active work-in-progress.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, in_development: !formData.in_development })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${formData.in_development ? 'bg-amber-500' : 'bg-zinc-800'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${formData.in_development ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 tracking-widest uppercase">Cover Image Asset</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer w-full transition-colors" />
                    {formData.image && (
                      <div className="mt-4 border border-zinc-800 p-2 bg-zinc-900/50">
                        <img src={formData.image} alt="Project asset" className="h-32 w-full object-cover" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 tracking-widest uppercase">Short Description (Grid Preview)</label>
                    <textarea required name="short_desc" value={formData.short_desc || ''} onChange={handleInputChange} rows="2" maxLength="180" placeholder="A brief 1-2 sentence summary for the main project grid..." className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white resize-none focus:outline-none focus:border-zinc-500 transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 tracking-widest uppercase">Main Description (Detail Page)</label>
                    <textarea required name="desc" value={formData.desc || ''} onChange={handleInputChange} rows="6" placeholder="The deep dive explanation..." className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white resize-y focus:outline-none focus:border-zinc-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Bill of Materials (BOM) (Optional)</label><textarea name="bom" value={formData.bom || ''} onChange={handleInputChange} rows="4" placeholder="List components in CSV format..." className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white resize-none focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Hardware Pin Architecture (Optional)</label><textarea name="hardware_pins" value={formData.hardware_pins || ''} onChange={handleInputChange} rows="4" placeholder="Pin mappings..." className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white font-mono text-[10px] resize-y focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Arduino Firmware (C++) (Optional)</label><textarea name="firmware_code" value={formData.firmware_code || ''} onChange={handleInputChange} rows="6" placeholder="#include <AccelStepper.h>..." className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-emerald-400 font-mono text-[10px] resize-y focus:outline-none focus:border-zinc-500 transition-colors" /></div>

                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Simulation HTML Code (Optional)</label><textarea name="simulation_code" value={formData.simulation_code || ''} onChange={handleInputChange} rows="4" placeholder="<!DOCTYPE html>..." className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white font-mono text-[10px] resize-y focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Routing Link ID</label><input type="text" required name="link" value={formData.link || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                </>
              )}

              {activeTab === 'Education' && (
                <>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Institution</label><input type="text" required name="institution" value={formData.institution || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Degree</label><input type="text" required name="degree" value={formData.degree || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">From</label><input type="text" required name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="e.g. 2021" /></div>
                    <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">To</label><input type="text" required name="endDate" value={formData.endDate || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="e.g. Present" /></div>
                  </div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Description / GPA</label><textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows="3" className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white resize-none focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Skills (Comma Separated)</label><input type="text" name="skills" value={formData.skills || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                </>
              )}

              {activeTab === 'Experience' && (
                <>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Company</label><input type="text" required name="company" value={formData.company || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Role / Job Title</label><input type="text" required name="role" value={formData.role || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">From</label><input type="text" required name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="e.g. Jan 2022" /></div>
                    <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">To</label><input type="text" required name="endDate" value={formData.endDate || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="e.g. Dec 2023" /></div>
                  </div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Description</label><textarea required name="description" value={formData.description || ''} onChange={handleInputChange} rows="4" className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white resize-none focus:outline-none focus:border-zinc-500 transition-colors" /></div>
                </>
              )}

              {activeTab === 'Skills' && (
                <>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Category</label><input type="text" required name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="e.g., Hardware, Software, Tools" /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 tracking-widest uppercase">Skill Name</label><input type="text" required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full bg-zinc-900/50 border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors" placeholder="e.g., React, PLC Programming, AutoCAD" /></div>
                </>
              )}
              
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button type="submit" disabled={status === 'loading' || isUploading} className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest font-bold hover:bg-zinc-300 transition-colors disabled:opacity-50">
                  {status === 'loading' ? 'SAVING...' : formData.id ? 'UPDATE ENTRY' : 'PUBLISH'}
                </button>
                
                {formData.id && activeTab !== 'Profile' && (
                  <button type="button" onClick={() => setFormData({})} className="px-6 py-3 border border-zinc-800 text-zinc-400 text-xs tracking-widest uppercase hover:text-white hover:border-zinc-600 transition-colors">
                    CANCEL
                  </button>
                )}
                
                {status === 'success' && <span className="text-xs tracking-widest uppercase text-emerald-400 font-light ml-auto">Saved!</span>}
                {status === 'error' && <span className="text-xs tracking-widest uppercase text-red-400 font-light ml-auto">Error!</span>}
              </div>
            </form>
          )}
        </motion.div>

        {activeTab !== 'Settings' && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            className="border border-zinc-800/50 bg-zinc-950/50 p-8 h-fit"
          >
            <h2 className="text-2xl font-light text-white tracking-tight mb-8">Manage {activeTab}</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {dbData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 group transition-colors hover:border-zinc-600">
                  <div className="truncate mr-4">
                    <div className="text-white font-light text-sm truncate">{getDisplayTitle(item)}</div>
                    <div className="text-zinc-500 text-[10px] tracking-widest uppercase mt-1 truncate">{getDisplaySubtitle(item)}</div>
                  </div>
                  
                  {activeTab !== 'Profile' && (
                    <div className="flex gap-2 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className="text-[10px] tracking-widest uppercase text-emerald-500 hover:text-emerald-400 border border-emerald-900/50 hover:bg-emerald-950/30 px-3 py-1 transition-colors flex-shrink-0">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-[10px] tracking-widest uppercase text-red-500 hover:text-red-400 border border-red-900/50 hover:bg-red-950/30 px-3 py-1 transition-colors flex-shrink-0">Delete</button>
                    </div>
                  )}
                </div>
              ))}
              {dbData.length === 0 && <p className="text-zinc-500 text-sm font-light">No entries found in {activeTab}.</p>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}