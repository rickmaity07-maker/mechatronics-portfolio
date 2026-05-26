import React, { useRef, useState, useEffect } from 'react';

export default function SimulationFrame({ simulationCode }) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for the native escape key to update our UI state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Enter Fullscreen
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      // Exit Fullscreen
      document.exitFullscreen();
    }
  };

  if (!simulationCode) return null;

  return (
    <div className="mt-16">
      <h3 className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-4">
        Interactive Digital Twin
      </h3>
      
      {/* We put the ref on this wrapper div so the button goes fullscreen WITH the iframe */}
      <div 
        ref={containerRef} 
        className={`relative border border-zinc-800/50 bg-[#050505] rounded-sm overflow-hidden ${isFullscreen ? 'h-screen w-screen' : 'h-[600px] w-full'}`}
      >
        
        {/* Fullscreen Toggle Button */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-10 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white p-2 rounded-sm backdrop-blur-md transition-all group"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            /* Shrink Icon */
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Expand Icon */
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        {/* The Actual Simulation */}
        <iframe 
          srcDoc={simulationCode} 
          className="w-full h-full border-none"
          title="Engineering Simulation"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}