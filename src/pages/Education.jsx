import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Education() {
  // 1. STATE: Hold the data and track the loading status
  const [educationData, setEducationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. FETCH DATA: Pull from Supabase when the page loads
  useEffect(() => {
    const fetchEducation = async () => {
      const { data, error } = await supabase
        .from('Education')
        .select('*')
        .order('id', { ascending: false }); // Shows newest entries first

      if (error) {
        console.error("Error fetching education:", error);
      } else {
        setEducationData(data);
      }
      setIsLoading(false);
    };

    fetchEducation();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Education</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="text-zinc-500 text-sm tracking-widest uppercase animate-pulse pt-4">
          Loading Database...
        </div>
      ) : (
        /* Experience-Style List */
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
                
                <p className="text-zinc-500 font-light text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                  {item.description}
                </p>
                
                {/* Dynamically render skills if they exist in the database */}
                {item.skills && item.skills.trim() !== '' && (
                  <div className="flex flex-wrap gap-2">
                    {/* Split the comma-separated string from Supabase into individual tags */}
                    {item.skills.split(',').map((skill, index) => (
                      <span 
                        key={index} 
                        className="text-[10px] uppercase tracking-wider px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Fallback if database is completely empty */}
          {educationData.length === 0 && !isLoading && (
            <p className="text-zinc-500 font-light">No education history available.</p>
          )}
        </div>
      )}
    </div>
  );
}