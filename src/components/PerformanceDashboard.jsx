import React from 'react';
import { Clock, Timer, Navigation, Activity } from 'lucide-react';

export default function PerformanceDashboard({ metrics }) {
  const stats = [
    { label: "Avg Waiting Time", value: metrics.averageWaitTime, unit: "ms", icon: <Clock size={20} className="text-amber-400" /> },
    { label: "Avg Turnaround Time", value: metrics.averageTurnaroundTime, unit: "ms", icon: <Timer size={20} className="text-emerald-400" /> },
    { label: "Avg Seek Time", value: metrics.averageSeekTime, unit: "tracks", icon: <Navigation size={20} className="text-blue-400" /> },
    { label: "Throughput", value: metrics.throughput, unit: "req/ms", icon: <Activity size={20} className="text-purple-400" /> }
  ];

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Performance Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="mb-2 bg-slate-800 p-2 rounded-full border border-slate-600">
              {stat.icon}
            </div>
            <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
            <div className="mt-1 font-bold text-lg text-slate-200">
              {stat.value} <span className="text-xs font-normal text-slate-500">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
