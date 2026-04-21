import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function QueueVisualization({ requests, results }) {
  const displayQueue = results ? results.executionOrder : requests;

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {results ? "Execution Order" : "Incoming Queue"}
      </h2>
      
      {displayQueue.length === 0 ? (
        <div className="text-slate-500 text-sm text-center py-8 border border-dashed border-slate-700 rounded-lg">
          Queue is empty. Add requests to start.
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {displayQueue.map((req, idx) => (
              <div key={idx} className="flex items-center">
                <div className="bg-slate-900 border border-slate-600 rounded-lg p-3 min-w-[120px] flex flex-col items-center shadow-md relative">
                  <span className="absolute -top-2 -left-2 bg-blue-600 text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-200">{req.id}</span>
                  <span className="text-xs text-slate-400 mt-1">Loc: {req.diskLocation}</span>
                  <span className="text-xs text-slate-500">Arr: {req.arrivalTime}</span>
                  {results && (
                    <span className="text-xs text-emerald-400 mt-1">Wait: {req.waitTime}</span>
                  )}
                </div>
                {idx < displayQueue.length - 1 && (
                  <ArrowRight size={20} className="text-slate-600 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
