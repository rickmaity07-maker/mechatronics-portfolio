import React from 'react';
import { motion } from 'framer-motion';

// --- BRAND ICONS ---
import { 
  SiReact, SiNextdotjs, SiTailwindcss, SiFramer, SiSupabase, 
  SiPython, SiJavascript, SiTypescript, SiHtml5, SiCss3, 
  SiCplusplus, SiC, SiArduino, SiAutodesk, SiFigma, 
  SiGithub, SiVercel, SiNodedotjs, SiDocker, SiRaspberrypi
} from 'react-icons/si';

import { 
  FaRocket, FaPrint, FaMicrochip, FaRobot, FaCogs, FaBolt
} from 'react-icons/fa6';

// --- THE BULLETPROOF DICTIONARY ---
const iconMap = {
  "react": <SiReact />,
  "react.js": <SiReact />,
  "next.js": <SiNextdotjs />,
  "tailwind css": <SiTailwindcss />,
  "tailwind": <SiTailwindcss />,
  "framer motion": <SiFramer />,
  "supabase": <SiSupabase />,
  "javascript": <SiJavascript />,
  "typescript": <SiTypescript />,
  "html": <SiHtml5 />,
  "css": <SiCss3 />,
  "node.js": <SiNodedotjs />,
  "github": <SiGithub />,
  "vercel": <SiVercel />,
  "docker": <SiDocker />,
  "ui/ux design": <SiFigma />,
  "figma": <SiFigma />,
  "python": <SiPython />,
  "c++": <SiCplusplus />,
  "c": <SiC />,
  "arduino": <SiArduino />,
  "raspberry pi": <SiRaspberrypi />,
  "fusion 360": <SiAutodesk />,
  "cad modeling": <SiAutodesk />,
  "3d printing": <FaPrint />,
  "klipper": <FaPrint />,
  "rocketry": <FaRocket />,
  "mechatronics": <FaRobot />,
  "robotics": <FaRobot />,
  "iot": <FaMicrochip />,
  "circuit analysis": <FaBolt />,
  "pcb design": <FaCogs />,
  "machine learning": <FaCogs />
};

export default function SkillsMarquee({ skills }) {
  // Failsafe: If no skills load from the database yet, don't crash.
  if (!skills || skills.length === 0) return null;

  const doubledSkills = [...skills, ...skills, ...skills];

  return (
    <div className="w-full relative bg-zinc-950/30 border-y border-zinc-800/30 py-6 overflow-hidden">
      <motion.div 
        className="flex items-center gap-12 w-max"
        animate={{ x: ["0%", "-33.33%"] }} 
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubledSkills.map((skillItem, index) => {
          
          // 🚨 THE FIX: This detects your text whether it is an object {name: 'React'}, {title: 'React'}, or just a string 'React'
          const rawText = typeof skillItem === 'string' 
            ? skillItem 
            : (skillItem.name || skillItem.title || skillItem.skill || "Unknown");
          
          // Match it to the dictionary
          const safeName = rawText.toLowerCase().trim();
          const IconComponent = iconMap[safeName];

          return (
            <div key={index} className="flex items-center gap-4 group cursor-default">
              
              {/* THE ICON */}
              <span className="text-zinc-600 group-hover:text-white transition-colors duration-500 text-xl">
                {IconComponent ? IconComponent : "✦"}
              </span>
              
              {/* THE TEXT */}
              <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors duration-500 tracking-[0.3em] uppercase text-sm whitespace-nowrap">
                {rawText}
              </span>
              
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}