import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Experience() {
  const [experienceData, setExperienceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data, error } = await supabase
        .from('Experience')
        .select('*')
        .order('id', { ascending: false }); // Newest entries at the top

      if (!error && data) {
        setExperienceData(data);
      }
      setIsLoading(false);
    };

    fetchExperience();
  }, []);

  return (
    <div className="animate-fade-in-up space-y-12 max-w-4xl">
      <div>
        <h1 className="text-4xl font-light text-white tracking-tight mb-4">Experience</h1>
        <div className="h-px w-24 bg-zinc-800"></div>
      </div>

      {isLoading ? (
        <div className="text-zinc-500 text-sm tracking-widest uppercase animate-pulse pt-4">
          Loading Database...
        </div>
      ) : (
        <div className="space-y-12 pt-4">
          {experienceData.map((item) => (
            <div key={item.id} className="group md:grid md:grid-cols-4 md:gap-8 items-baseline border-b border-zinc-800/30 pb-12 last:border-none">
              
              {/* Left Column: Dates */}
              <div className="md:col-span-1 mb-4 md:mb-0">
                <span className="text-zinc-500 text-xs tracking-widest uppercase block md:mt-1">
                  {item.period}
                </span>
              </div>
              
              {/* Right Column: Details */}
              <div className="md:col-span-3">
                <h3 className="text-xl text-white font-light mb-1">{item.role}</h3>
                <p className="text-zinc-400 text-sm tracking-widest uppercase mb-4">{item.company}</p>
                <p className="text-zinc-500 font-light text-sm leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
          
          {experienceData.length === 0 && <p className="text-zinc-500 font-light">No experience history available.</p>}
        </div>
      )}
    </div>
  );
}