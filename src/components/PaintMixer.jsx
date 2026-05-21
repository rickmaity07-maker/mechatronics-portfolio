import React, { useState, useEffect } from 'react';

export default function PaintMixer() {
  const [hexCode, setHexCode] = useState('#56776b');
  const [hardwareMath, setHardwareMath] = useState({ c: 0, m: 0, y: 0, k: 0, w: 0 });
  const [isDispensing, setIsDispensing] = useState(false);
  const [simulatedMix, setSimulatedMix] = useState('transparent');

  const calculateFluidDynamics = (hex) => {
    const cleanHex = hex.replace('#', '');
    if (cleanHex.length !== 6) return;
    
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    let cPrint = 0, mPrint = 0, yPrint = 0;
    const kPrint = 1 - Math.max(r, g, b);
    
    if (kPrint < 1) {
      cPrint = (1 - r - kPrint) / (1 - kPrint);
      mPrint = (1 - g - kPrint) / (1 - kPrint);
      yPrint = (1 - b - kPrint) / (1 - kPrint);
    }
    const wBase = Math.min(r, g, b);

    const standard = { c: cPrint * 100, m: mPrint * 100, y: yPrint * 100, k: kPrint * 100, w: wBase * 100 };
    const sum = standard.c + standard.m + standard.y + standard.k + standard.w;
    
    if (sum === 0) {
      setHardwareMath({ c: 0, m: 0, y: 0, k: 0, w: 100 });
    } else {
      setHardwareMath({
        c: Number(((standard.c / sum) * 100).toFixed(1)),
        m: Number(((standard.m / sum) * 100).toFixed(1)),
        y: Number(((standard.y / sum) * 100).toFixed(1)),
        k: Number(((standard.k / sum) * 100).toFixed(1)),
        w: Number(((standard.w / sum) * 100).toFixed(1)),
      });
    }
  };

  useEffect(() => {
    calculateFluidDynamics(hexCode);
    setSimulatedMix('transparent');
  }, [hexCode]);

  const handleDispense = () => {
    setIsDispensing(true);
    setSimulatedMix('transparent');
    setTimeout(() => {
      setSimulatedMix(hexCode);
      setIsDispensing(false);
    }, 2500);
  };

  return (
    <div className="w-full font-sans border border-zinc-800/50 bg-zinc-950/30 p-4 md:p-10">
      <header className="mb-12 border-b border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-light tracking-tight text-white">5-Axis Paint Mixer</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mt-2">Mechatronics Simulation</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${isDispensing ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-20">
        {/* Controls */}
        <div className="space-y-12">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">Target Hex Code</label>
            <div className="flex items-center gap-4">
              <div className="p-1 border border-zinc-800 bg-zinc-900 rounded-sm hover:border-zinc-500 transition-colors">
                <input type="color" value={hexCode} onChange={(e) => setHexCode(e.target.value)} className="w-12 h-12 bg-transparent cursor-crosshair border-0 p-0 block"/>
              </div>
              <input type="text" value={hexCode.toUpperCase()} onChange={(e) => setHexCode(e.target.value)} className="bg-transparent border-b border-zinc-800 text-3xl font-light text-white focus:outline-none focus:border-zinc-500 uppercase tracking-widest w-full pb-2 transition-colors" maxLength={7}/>
            </div>
            <button onClick={handleDispense} disabled={isDispensing} className="w-full mt-8 bg-white text-black py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-zinc-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isDispensing ? 'Actuating Steppers...' : 'Execute Sequence'}
            </button>
          </div>

          <div className="p-6 border border-zinc-800/50 bg-zinc-900/30">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4">Hardware Volumetric Setup</p>
            <div className="space-y-2 font-mono text-xs text-zinc-400">
              <p>Pump C: <span className="text-emerald-400">{hardwareMath.c}%</span></p>
              <p>Pump M: <span className="text-emerald-400">{hardwareMath.m}%</span></p>
              <p>Pump Y: <span className="text-emerald-400">{hardwareMath.y}%</span></p>
              <p>Pump K: <span className="text-emerald-400">{hardwareMath.k}%</span></p>
              <p>Pump W: <span className="text-emerald-400">{hardwareMath.w}%</span></p>
            </div>
          </div>
        </div>

        {/* Hardware Simulation */}
        <div className="flex flex-col h-full bg-zinc-900/20 border border-zinc-800/50 p-6 md:p-8 relative">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-10 text-center">Dispensing Chamber</p>
          
          {/* 5 Syringe Bottles */}
          <div className="flex justify-around items-start h-48 border-b border-zinc-800/50 pb-8 relative z-10">
            {Object.entries(hardwareMath).map(([color, pct]) => {
              const bgColors = { c: '#00ffff', m: '#ff00ff', y: '#ffff00', k: '#1a1a1a', w: '#ffffff' };
              const isPumping = isDispensing && pct > 0;
              
              return (
                <div key={color} className="flex flex-col items-center">
                  <div className="w-8 md:w-10 h-24 md:h-32 border border-zinc-700 rounded-t-sm rounded-b-xl overflow-hidden relative bg-zinc-950">
                    <div 
                      className="w-full absolute bottom-0 transition-all duration-[2500ms] ease-out" 
                      style={{ height: `${isDispensing ? (100 - pct) : 100}%`, backgroundColor: bgColors[color], opacity: color === 'k' ? 0.9 : 0.8 }} 
                    />
                  </div>
                  <div className="w-1.5 h-3 bg-zinc-700 rounded-b-sm mt-1" />
                  
                  <div className="h-16 w-full flex justify-center mt-1">
                    {isPumping && (
                      <div className="w-1 h-full animate-[pulse_0.1s_ease-in-out_infinite]" style={{ background: `linear-gradient(to bottom, ${bgColors[color]}, transparent)` }} />
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600 mt-2">{color}</span>
                </div>
              );
            })}
          </div>

          {/* Centrifugal Mixing Jar */}
          <div className="flex-1 flex flex-col items-center justify-center pt-8 relative">
            <div className="relative">
              <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border border-zinc-700 overflow-hidden relative bg-zinc-950 transition-all ${isDispensing ? 'animate-[spin_1s_linear_infinite] border-zinc-500' : ''}`}>
                <div className="absolute inset-0 transition-colors duration-[2500ms] ease-in-out" style={{ backgroundColor: simulatedMix }} />
                <div className="absolute inset-0 rounded-full border-[8px] border-white/5 pointer-events-none" />
                <div className="absolute top-4 left-4 w-10 h-5 bg-white/10 rounded-full blur-sm rotate-45 pointer-events-none" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-900 rounded-full border border-zinc-700 z-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}