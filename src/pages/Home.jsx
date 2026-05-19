import React from 'react';
import { Link } from 'react-router-dom';
import profilePhoto from '../assets/profile.jpg';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-16 animate-fade-in-up">
      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <h2 className="text-zinc-500 tracking-[0.2em] text-sm uppercase">Mechatronics Engineer</h2>
          <h1 className="text-5xl md:text-7xl font-light text-white tracking-tight">
            Rick Maity
          </h1>
        </div>
        <div className="h-px w-24 bg-zinc-800"></div>
        <p className="text-lg leading-relaxed text-zinc-400 max-w-2xl">
          Passionate Mechatronics Engineer with strong experience in automation systems, 
          robotic process design, and quality control. Demonstrated ability to integrate mechanical, 
          electronic, and software components into innovative real-world solutions. 
        </p>
        <div className="flex items-center space-x-6 pt-4">
          <Link to="/projects" className="px-8 py-3 bg-white text-black text-sm font-semibold tracking-wide hover:bg-zinc-200 transition-colors">
            VIEW PROJECTS
          </Link>
          <div className="flex flex-col text-sm space-y-1 border-l border-zinc-800 pl-6">
            <span className="text-zinc-300">rick..maity07@gmail.com</span>
            <span className="text-zinc-500">+49-1723077465</span>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full flex justify-end">
        <div className="relative w-full max-w-md aspect-[4/5] group">
          <div className="absolute inset-0 border border-zinc-800 translate-x-4 translate-y-4"></div>
          <div className="absolute inset-0 overflow-hidden border border-zinc-800/50">
            <img src={profilePhoto} alt="Rick Maity" className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}