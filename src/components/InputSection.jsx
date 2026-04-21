import React, { useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';

export default function InputSection({ onAdd, onClear }) {
  const [arrivalTime, setArrivalTime] = useState(0);
  const [fileSize, setFileSize] = useState(100);
  const [diskLocation, setDiskLocation] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      arrivalTime: Number(arrivalTime),
      fileSize: Number(fileSize),
      diskLocation: Number(diskLocation)
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const lines = content.split('\n');
      lines.forEach(line => {
        const parts = line.trim().split(',');
        if (parts.length >= 3) {
          onAdd({
            arrivalTime: Number(parts[0]),
            fileSize: Number(parts[1]),
            diskLocation: Number(parts[2])
          });
        }
      });
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Add Request</h2>
        <div className="flex gap-2">
          <label className="cursor-pointer text-slate-400 hover:text-blue-400 p-2 rounded-lg bg-slate-900 border border-slate-700 transition" title="Upload CSV (arrival,size,location)">
            <Upload size={18} />
            <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
          </label>
          <button onClick={onClear} className="text-slate-400 hover:text-red-400 p-2 rounded-lg bg-slate-900 border border-slate-700 transition" title="Clear All">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Current Head Position </label>
            <input
              type="number" min="0" required
              value={arrivalTime} onChange={e => setArrivalTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs text-slate-400 mb-1">Track No.</label>
            <input
              type="number" min="0" max="199" required
              value={diskLocation} onChange={e => setDiskLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition border border-slate-600 hover:border-slate-500">
          <Plus size={18} />
          Add to Queue
        </button>
      </form>
    </div>
  );
}
