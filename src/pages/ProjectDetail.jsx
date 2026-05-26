import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import ExpandableImage from '../components/ExpandableImage';
import SimulationFrame from '../components/SimulationFrame';

// --- DATA PARSER ---
const parseCSV = (csvText) => {
  if (!csvText) return [];
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }
  return rows.filter(row => row.join('').trim() !== '');
};

// --- RUNTIME INJECTION: PREVENT IFRAME SCROLL JUMP ---
const injectScrollBlocker = (htmlCode) => {
  if (!htmlCode) return "";
  
  const blockerScript = `
    <script>
      Element.prototype.scrollIntoView = function() {
        const container = this.parentElement;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      };
    </script>
  `;
  
  return htmlCode.replace('<head>', '<head>' + blockerScript);
};

export default function ProjectDetail() {
  const { projectId } = useParams(); 
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Force scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const searchLink = `/projects/${projectId}`;
      
      const { data, error } = await supabase
        .from('Projects')
        .select('*')
        .eq('link', searchLink)
        .single(); 

      if (!error && data) {
        setProject(data);
      }
      setIsLoading(false);
    };

    fetchProjectDetails();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="text-zinc-500 mt-32 text-center tracking-widest uppercase text-sm animate-pulse">
        Loading Project Data...
      </div>
    );
  }

  if (!project) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-32 text-center space-y-6">
        <h1 className="text-3xl text-white font-light">Project Not Found</h1>
        <p className="text-zinc-500">This project might have been removed from the database.</p>
        <Link to="/projects" className="inline-block px-8 py-3 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors uppercase tracking-widest text-xs">
          Return to Projects
        </Link>
      </motion.div>
    );
  }

  const bomRows = project.bom ? parseCSV(project.bom) : [];
  const bomHeaders = bomRows.length > 0 ? bomRows[0] : [];
  const bomData = bomRows.length > 1 ? bomRows.slice(1) : [];

  return (
    <div className="max-w-4xl mx-auto z-10 relative mt-8 pb-32">
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <Link to="/projects" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-white transition-colors flex items-center w-max">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Works
        </Link>
      </motion.div>

      <div className="space-y-12">
        
        {/* Title & Divider */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6"
          >
            {project.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-px w-24 bg-zinc-700 origin-left"
          ></motion.div>
        </div>

        {/* HERO IMAGE */}
        {project.image && project.image.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full pb-8"
          >
            <ExpandableImage
              src={project.image}
              alt={project.title}
              className="w-full aspect-video object-cover border border-zinc-800/50"
              layoutId={`project-img-${project.id}`}
            />
          </motion.div>
        )}

        {/* OVERVIEW / MAIN DESC */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-zinc-400 font-light leading-relaxed text-lg whitespace-pre-wrap">
            {project.desc}
          </p>
        </motion.div>

        {/* FULLSCREEN INTERACTIVE SIMULATION */}
        {project.simulation_code && project.simulation_code.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="w-full"
          >
            <SimulationFrame simulationCode={injectScrollBlocker(project.simulation_code)} />
          </motion.div>
        )}

        {/* BOM TABLE */}
        {bomRows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-16"
          >
            <h3 className="text-zinc-500 tracking-[0.2em] text-xs uppercase border-b border-zinc-800/50 pb-4 mb-6">Bill of Materials (BOM)</h3>
            <div className="overflow-x-auto border border-zinc-800/50 bg-zinc-950/30">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-widest">
                    {bomHeaders.map((header, i) => (
                      <th key={i} className="py-4 px-6 font-normal">{header.replace(/^"|"$/g, '')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm text-zinc-300 font-light divide-y divide-zinc-800/50">
                  {bomData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-zinc-900/30 transition-colors">
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          className={`py-4 px-6 leading-relaxed ${cellIndex === row.length - 1 ? 'w-1/2' : ''}`}
                        >
                          {cell.replace(/^"|"$/g, '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* HARDWARE PINS */}
        {project.hardware_pins && project.hardware_pins.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="pt-8"
          >
            <h3 className="text-zinc-500 tracking-[0.2em] text-xs uppercase border-b border-zinc-800/50 pb-4 mb-6">Hardware Pin Architecture</h3>
            <div className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-zinc-950/50 p-6 border border-zinc-800/50">
              {project.hardware_pins}
            </div>
          </motion.div>
        )}

        {/* FIRMWARE CODE */}
        {project.firmware_code && project.firmware_code.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8"
          >
            <h3 className="text-zinc-500 tracking-[0.2em] text-xs uppercase border-b border-zinc-800/50 pb-4 mb-6">Arduino Firmware (C++)</h3>
            <div className="w-full bg-[#0a0a0a] border border-zinc-800/50 p-6 overflow-x-auto">
              <pre className="text-emerald-400/90 font-mono text-xs md:text-sm leading-loose">
                <code>{project.firmware_code}</code>
              </pre>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}