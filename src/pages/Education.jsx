import React from 'react';

export default function Education() {
  // All your CV data, perfectly formatted
  const educationData = [
    {
      id: 1,
      institution: "Technische Hochschule Würzburg-Schweinfurt (THWS), Germany",
      degree: "B.Eng in Mechatronics Systems",
      period: "2023 — Present",
      description: "GPA: 2.7 / 5.0",
      skills: []
    },
    {
      id: 2,
      institution: "Berlin International College (BIC), Germany",
      degree: "Studienkolleg (Technical Foundation Program)",
      period: "2023 — Graduated",
      description: "GPA: 1.7 / 5.0",
      skills: []
    },
    {
      id: 3,
      institution: "Nettur Technical Training Foundation (NTTF), Bangalore, India",
      degree: "Diploma in Mechatronics Engineering",
      period: "2021 — Graduated",
      description: "GPA: 8.9 / 10",
      skills: ['Robot Arm Simulation', 'PLC', 'HMI', 'Embedded Systems', 'CNC', '3D Designing']
    },
    {
      id: 4,
      institution: "Mathagondapalli Model School, India",
      degree: "High School (Grade 12)",
      period: "2018 — Graduated",
      description: "PERCENTILE: 57%",
      skills: []
    },
    {
      id: 5,
      institution: "Mount Litera Zee School, India",
      degree: "Secondary School (Grade 10)",
      period: "2016 — Graduated",
      description: "GPA: 8.7 / 10",
      skills: []
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
              
              {/* Only render skills if the array has items */}
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