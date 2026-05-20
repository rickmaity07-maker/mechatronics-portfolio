import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Skills() {
  const [skillsData, setSkillsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from('Skills').select('*');

      if (error) {
        console.error("Error fetching skills:", error);
      } else if (data) {
        // Group the flat database rows into categories automatically
        const grouped = data.reduce((acc, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill.name);
          return acc;
        }, {});
        
        setSkillsData(grouped);
      }
      setIsLoading(false);
    };

    fetchSkills();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-12 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Technical Capabilities</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-sm tracking-widest uppercase animate-pulse pt-4">
          Loading Database...
        </div>
      ) : (
        /* Dynamic Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {Object.keys(skillsData).map((category, index) => (
            <div key={index} className="border border-zinc-800/50 bg-zinc-950/50 p-8 hover:border-zinc-700 transition-colors">
              <h3 className="text-xs text-zinc-500 tracking-[0.2em] uppercase mb-8">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillsData[category].map((skillName, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className="text-sm font-light text-zinc-300 px-4 py-2 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors"
                  >
                    {skillName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}