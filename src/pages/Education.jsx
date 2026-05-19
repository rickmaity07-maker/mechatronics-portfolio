import React from 'react';

export default function Education() {
  // 1. DATA ARRAY: Keeps your code clean and makes adding degrees easy!
  const educationData = [
    {
      id: 1,
      institution: "Technical University of Applied Sciences Würzburg-Schweinfurt (THWS)",
      degree: "Mechatronics Engineering",
      period: "Present",
      description: "Focusing on the integration of mechanical engineering, electrical engineering, and computer science to design and build intelligent systems and automated manufacturing processes.",
      skills: [] // Empty array since it's ongoing, or add current focus areas!
    },
    {
      id: 2,
      institution: "Nettur Technical Training Foundation (NTTF)",
      degree: "Diploma in Mechatronics Engineering",
      period: "Jun 2018 — Jun 2021",
      description: "Developed a strong foundational grip on practical engineering applications, robotics, and automated control systems.",
      skills: ['Robot Arm Simulation', 'PLC', 'HMI', 'Embedded Systems', 'CNC', '3D Designing']
    }
  ];

  return (
    <div className="animate-fade-in-up space-y-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Education</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      {/* Experience-Style List */}
      <div className="space-y-12 pt-4">
        {educationData.map((item) => (
          <div 
            key={item.id} 
            className="group md:grid md:grid-cols-4 md:gap-8 items-baseline border-b border-zinc-800/30 pb-12 last:border-none"
          >
            {/* Left Column: Dates */}
            <div className="md:col-span-1 mb-4 md:mb-0">
              <span className="text-zinc-500 text-xs tracking-widest uppercase block md:mt-1">
                {item.period}
              </span>
            </div>

            {/* Right Column: Details */}
            <div className="md:col-span-3">
              <h3 className="text-xl text-white font-light mb-1">{item.degree}</h3>
              <p className="text-zinc-400 text-sm tracking-widest uppercase mb-4">{item.institution}</p>
              
              <p className="text-zinc-500 font-light text-sm leading-relaxed mb-6">
                {item.description}
              </p>
              
              {/* Render skills tags only if the array has items */}
              {item.skills && item.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="text-[10px] uppercase tracking-wider px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}