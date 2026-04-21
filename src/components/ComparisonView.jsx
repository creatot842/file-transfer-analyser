import React, { useMemo } from 'react';
import { calculateFCFS, calculateSSTF, calculateSCAN } from '../utils/schedulingAlgorithms';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ComparisonView({ requests, initialHead, totalTracks }) {
  const data = useMemo(() => {
    if (requests.length === 0) return [];
    
    const fcfs = calculateFCFS(requests, initialHead).metrics;
    const sstf = calculateSSTF(requests, initialHead).metrics;
    const scan = calculateSCAN(requests, initialHead, totalTracks, 'up').metrics;

    return [
      {
        name: 'FCFS',
        WaitTime: Number(fcfs.averageWaitTime),
        TurnaroundTime: Number(fcfs.averageTurnaroundTime),
        SeekTime: Number(fcfs.averageSeekTime),
      },
      {
        name: 'SSTF',
        WaitTime: Number(sstf.averageWaitTime),
        TurnaroundTime: Number(sstf.averageTurnaroundTime),
        SeekTime: Number(sstf.averageSeekTime),
      },
      {
        name: 'SCAN',
        WaitTime: Number(scan.averageWaitTime),
        TurnaroundTime: Number(scan.averageTurnaroundTime),
        SeekTime: Number(scan.averageSeekTime),
      }
    ];
  }, [requests, initialHead, totalTracks]);

  if (data.length === 0) return null;

  // Find the best for WaitTime (lowest)
  const bestAlgo = [...data].sort((a, b) => a.WaitTime - b.WaitTime)[0].name;

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Algorithm Comparison</h2>
        <div className="text-sm px-3 py-1 bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 rounded-full">
          Best Performer (Wait Time): <strong>{bestAlgo}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 rounded-t-lg border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Avg Wait Time</th>
                <th className="px-4 py-3">Avg Turnaround</th>
                <th className="px-4 py-3">Avg Seek Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.name} className={`border-b border-slate-700/50 hover:bg-slate-700/30 ${bestAlgo === row.name ? 'bg-blue-900/10' : ''}`}>
                  <td className="px-4 py-3 font-medium text-white">{row.name}</td>
                  <td className={`px-4 py-3 ${bestAlgo === row.name ? 'text-emerald-400 font-bold' : ''}`}>{row.WaitTime} ms</td>
                  <td className="px-4 py-3">{row.TurnaroundTime} ms</td>
                  <td className="px-4 py-3">{row.SeekTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="WaitTime" fill="#3b82f6" name="Wait Time" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TurnaroundTime" fill="#10b981" name="Turnaround Time" radius={[4, 4, 0, 0]} />
              <Bar dataKey="SeekTime" fill="#8b5cf6" name="Seek Time" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
