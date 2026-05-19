import React from 'react';

export default function Education() {
  return (
    <div className="animate-fade-in-up space-y-12">
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Education</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>
      
      <div className="border border-zinc-800/50 bg-zinc-950/50 p-8 hover:border-zinc-500 transition-colors">
        <h3 className="text-2xl font-light text-white mb-2">Technical University of Applied Sciences Würzburg-Schweinfurt (THWS)</h3>
        <p className="text-zinc-500 text-sm tracking-widest uppercase mb-6">Mechatronics Engineering</p>
        
        <div className="space-y-4 text-zinc-400">
          <p className="leading-relaxed">
            Focusing on the integration of mechanical engineering, electrical engineering, and computer science to design and build intelligent systems and automated manufacturing processes.
          </p>
        </div>
      </div>
    </div>
  );
}