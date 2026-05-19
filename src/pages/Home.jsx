import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profilePhoto from '../assets/profile.jpg';
import { supabase } from '../supabaseClient'; 

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]); 
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('Projects').select('*');
      if (error) {
        console.error("Error fetching projects:", error);
      }
      if (data) {
        setFeaturedProjects(data);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

  const skillsMarquee = [
    "Fusion 360", "SolidWorks", "Python", "React", "IoT Systems", 
    "PLC Programming", "Robotics", "Embedded C", "3D Printing", "CNC Machining"
  ];

  // Auto-play the slider
  useEffect(() => {
    if (featuredProjects.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredProjects.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [featuredProjects.length]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-32 pb-12 overflow-hidden">
      {/* --- HERO SECTION --- */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-16 animate-fade-in-up">
        <div className="flex-1 space-y-8">
          <div className="space-y-2">
            <h2 className="text-zinc-500 tracking-[0.2em] text-sm uppercase">Mechatronics Engineer</h2>
            <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight">Rick Maity</h1>
          </div>
          <div className="h-px w-24 bg-zinc-800"></div>
          <p className="text-lg leading-relaxed text-zinc-400 max-w-2xl">
            Passionate Mechatronics Engineer with strong experience in automation systems, 
            robotic process design, and quality control. 
          </p>
          
          <div className="flex items-center gap-8 pt-4">
            <Link to="/projects" className="px-8 py-3 bg-white text-black text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-colors whitespace-nowrap">
              VIEW PROJECTS
            </Link>
            
            <div className="relative group py-4">
              <div className="flex items-center text-sm font-light tracking-[0.4em] text-zinc-400 hover:text-zinc-100 transition-colors uppercase cursor-pointer">
                Contact
                <span className="ml-4 font-light text-xl opacity-70 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300 rotate-90">→</span>
              </div>

              <div className="absolute left-0 top-full mt-2 w-max p-6 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex flex-col gap-6">
                <div>
                  <span className="text-[10px] text-zinc-600 tracking-widest uppercase block mb-2">Email</span>
                  <div className="flex items-center gap-6 group/email">
                    <a href="mailto:rick..maity07@gmail.com" className="text-zinc-300 hover:text-white transition-colors text-sm">rick..maity07@gmail.com</a>
                    <button onClick={() => handleCopy('rick..maity07@gmail.com')} className="text-[10px] text-zinc-500 hover:text-zinc-300 opacity-0 group-hover/email:opacity-100 transition-opacity border border-zinc-800 px-2 py-1">
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>
                </div>
                <div className="h-px w-full bg-zinc-800/50"></div>
                <div>
                  <span className="text-[10px] text-zinc-600 tracking-widest uppercase block mb-2">Phone / Direct</span>
                  <a href="tel:+491723077465" className="text-zinc-300 hover:text-white transition-colors text-sm block">+49-1723077465</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full flex justify-end">
          <div className="relative w-full max-w-md aspect-[4/5] group">
            <div className="absolute inset-0 border border-zinc-800 translate-x-4 translate-y-4"></div>
            <div className="absolute inset-0 overflow-hidden border border-zinc-800/50 bg-zinc-900">
              <img src={profilePhoto} alt="Rick Maity" className="w-full h-full object-cover contrast-125 transition-all duration-700" />
            </div>
          </div>
        </div>
      </div>

      {/* --- DYNAMIC PROJECTS SLIDER --- */}
      <div className="animate-fade-in-up border-t border-zinc-800/50 pt-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-white text-2xl font-light">Featured Projects</h3>
            <p className="text-zinc-500 text-sm mt-1">Live from the database</p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button onClick={() => setCurrentSlide((prev) => (prev === 0 ? featuredProjects.length - 1 : prev - 1))} className="p-3 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">←</button>
            <button onClick={() => setCurrentSlide((prev) => (prev === featuredProjects.length - 1 ? 0 : prev + 1))} className="p-3 border border-zinc-800 text-zinc-400 hover:text-white transition-colors">→</button>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-zinc-500">Loading your work...</div>
        ) : featuredProjects.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800">
            Database connected, but no projects found. (Check RLS policies in Supabase!)
          </div>
        ) : (
          <div className="overflow-hidden border border-zinc-800/50 bg-zinc-900/30 relative">
            <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {featuredProjects.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                  <div>
                    <h4 className="text-3xl text-white font-light mt-2 mb-4">{item.title}</h4>
                    <p className="text-zinc-400 max-w-lg">{item.desc}</p>
                  </div>
                  <Link to={item.link} className="px-6 py-2 border border-zinc-700 text-zinc-300 hover:bg-white hover:text-black transition-all text-sm tracking-wider uppercase whitespace-nowrap">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View All Projects Button */}
        <div className="flex justify-center mt-10">
          <Link to="/projects" className="px-8 py-3 border border-zinc-700 text-zinc-300 hover:bg-white hover:text-black transition-all text-sm font-semibold tracking-wider uppercase">
            View All Projects
          </Link>
        </div>
      </div>

      {/* --- SKILLS MARQUEE --- */}
      <div className="animate-fade-in-up pb-8 border-t border-zinc-800/50 pt-16">
        <h3 className="text-white text-2xl font-light text-center mb-1">Core Competencies</h3>
        <p className="text-zinc-500 text-sm text-center mb-8">Hardware, software, and tools</p>
        
        <div className="relative flex overflow-x-hidden border-y border-zinc-800/50 bg-zinc-950/50 py-6 group">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10"></div>
          
          <div className="animate-scroll flex whitespace-nowrap cursor-default">
            {[...skillsMarquee, ...skillsMarquee].map((skill, index) => (
              <span key={index} className="mx-8 text-xl text-zinc-300 font-light hover:text-white transition-colors">
                {skill}
                <span className="ml-16 text-zinc-700 font-bold">•</span>
              </span>
            ))}
          </div>
        </div>
        
        {/* View Full Skillset Button */}
        <div className="flex justify-center mt-10">
          <Link to="/skills" className="px-8 py-3 border border-zinc-700 text-zinc-300 hover:bg-white hover:text-black transition-all text-sm font-semibold tracking-wider uppercase">
            View Full Skillset
          </Link>
        </div>
      </div>
      
    </div>
  );
}