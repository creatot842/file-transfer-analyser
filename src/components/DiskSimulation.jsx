import React, { useState, useEffect, useRef } from 'react';
import { HardDrive } from 'lucide-react';

export default function DiskSimulation({ results, status, initialHead, totalTracks, onComplete }) {
  const [currentHead, setCurrentHead] = useState(initialHead);
  const [activeFile, setActiveFile] = useState(null);
  const [visited, setVisited] = useState([initialHead]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (status === 'idle') {
      setCurrentHead(initialHead);
      setActiveFile(null);
      setVisited([initialHead]);
      if (animationRef.current) clearTimeout(animationRef.current);
    } else if (status === 'running' && results) {
      setVisited([initialHead]);
      let step = 0;
      
      const animateStep = () => {
        if (step >= results.executionOrder.length) {
          onComplete();
          return;
        }
        
        const req = results.executionOrder[step];
        setActiveFile(req);
        setCurrentHead(req.diskLocation);
        setVisited(prev => [...prev, req.diskLocation]);
        
        // Dynamic wait time for visual effect (base 1.5s per step)
        animationRef.current = setTimeout(() => {
          step++;
          animateStep();
        }, 1500);
      };

      animateStep();
    }
    
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [status, results, initialHead, onComplete]);

  // SVG dimensions
  const width = 800;
  const height = 150;
  const padding = 40;
  const usableWidth = width - padding * 2;
  
  const getX = (track) => padding + (track / (totalTracks - 1)) * usableWidth;

  // Path string for the visited tracks
  const pathData = visited.map((loc, idx) => {
    const x = getX(loc);
    const y = padding + (idx % 2 === 0 ? 0 : 50); // zig-zag slightly to avoid overlapping completely
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <HardDrive className="text-blue-400" /> Disk Head Simulation
        </h2>
        {activeFile && (
          <div className="bg-blue-900/40 text-blue-300 px-4 py-1 rounded-full text-sm font-medium border border-blue-800/50">
            Processing: {activeFile.id} at Track {activeFile.diskLocation}
          </div>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px] h-auto bg-slate-900/50 rounded-lg">
          {/* Track axis */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="2" />
          
          {/* Axis labels */}
          <text x={padding} y={height - 20} fill="#64748b" fontSize="12" textAnchor="middle">0</text>
          <text x={width / 2} y={height - 20} fill="#64748b" fontSize="12" textAnchor="middle">{totalTracks / 2}</text>
          <text x={width - padding} y={height - 20} fill="#64748b" fontSize="12" textAnchor="middle">{totalTracks - 1}</text>

          {/* Visited Path */}
          {visited.length > 1 && (
             <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
          )}

          {/* Points */}
          {visited.map((loc, idx) => {
            const x = getX(loc);
            const y = padding + (idx % 2 === 0 ? 0 : 50);
            return (
              <circle key={idx} cx={x} cy={y} r="4" fill="#60a5fa" />
            );
          })}

          {/* Current Head */}
          <g style={{ transition: 'transform 1s ease-in-out', transform: `translateX(${getX(currentHead)}px)` }}>
            <line x1="0" y1={padding - 20} x2="0" y2={height - padding} stroke="#f43f5e" strokeWidth="2" />
            <polygon points="-6,20 6,20 0,30" fill="#f43f5e" />
            <text x="0" y="10" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold">Head</text>
            <text x="0" y={height - padding + 15} fill="#f43f5e" fontSize="12" textAnchor="middle">{currentHead}</text>
          </g>
        </svg>
      </div>

      {visited.length > 0 && (
        <div className="mt-4 p-3 bg-slate-900/60 rounded-lg border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-2">Track Sequence</h3>
          <div className="flex flex-wrap gap-2 items-center text-sm font-mono text-slate-200">
            {visited.map((track, idx) => (
              <React.Fragment key={idx}>
                <span className={idx === 0 ? "text-blue-400 font-bold" : ""}>{track}</span>
                {idx < visited.length - 1 && <span className="text-slate-500">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
