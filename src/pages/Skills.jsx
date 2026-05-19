import React from 'react';

export default function Skills() {
  const skillCategories = [
    {
      title: "Tools & Platforms",
      skills: ['Fusion 360', 'SolidWorks', 'Creo', 'Inventor', 'Eagle', 'Power BI', 'CNC', 'PLC Programming', 'Robotic Arm Control']
    },
    {
      title: "Software & Development",
      skills: ['Python', 'Django', 'IoT Systems', 'Full Stack Development']
    },
    {
      title: "Automation",
      skills: ['Embedded Automation', 'PLC', 'HMI']
    },
    {
      title: "Languages",
      skills: ['English (Fluent)', 'German (Basic)', 'Hindi (Fluent)', 'Tamil (Fluent)', 'Bengali (Fluent)']
    }
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Technical Capabilities</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((category, index) => (
          <div key={index} className="p-8 bg-zinc-900/30 border border-zinc-800/50">
            <h3 className="text-sm uppercase tracking-[0.2em] text-zinc-500 mb-6">{category.title}</h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}