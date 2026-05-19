import React from 'react';

export default function Experience() {
  const experiences = [
    {
      company: 'Hash Studio',
      role: 'R&D Engineer',
      period: '2021 - 2022',
      achievements: [
        'Built a predictive maintenance system using IoT and ML, decreasing downtime by 15%.',
        'Designed and deployed robotic automation on production lines, improving efficiency by 30%.',
        'Developed an automated quality control system, reducing product defects by 20%.'
      ]
    },
    {
      company: 'Intel',
      role: 'R&D Engineer (Intern)',
      period: '2021',
      achievements: [
        'Worked on OneBox Mechanical Mechatronics product assembly.',
        'Supported machine deployment at client sites and handled post-deployment issue resolution.'
      ]
    }
  ];

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Work Experience</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      <div className="space-y-12 border-l border-zinc-800/50 pl-8 ml-4">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            {/* Timeline Node */}
            <div className="absolute -left-[37px] top-2 w-2 h-2 bg-zinc-500 rounded-full ring-4 ring-zinc-950"></div>
            
            <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4">
              <div>
                <h3 className="text-2xl text-white font-light">{exp.role}</h3>
                <h4 className="text-zinc-400 tracking-wider text-sm uppercase mt-1">{exp.company}</h4>
              </div>
              <span className="text-zinc-600 text-sm tracking-widest font-mono mt-2 md:mt-0">{exp.period}</span>
            </div>
            
            <ul className="space-y-3 mt-4 text-zinc-400">
              {exp.achievements.map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-zinc-700 mr-3 mt-1">▹</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
