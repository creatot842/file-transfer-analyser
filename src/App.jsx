import React, { useState, useEffect } from 'react';
import InputSection from './components/InputSection';
import QueueVisualization from './components/QueueVisualization';
import DiskSimulation from './components/DiskSimulation';
import PerformanceDashboard from './components/PerformanceDashboard';
import ComparisonView from './components/ComparisonView';
import { calculateFCFS, calculateSSTF, calculateSCAN } from './utils/schedulingAlgorithms';

export default function App() {
  const [requests, setRequests] = useState([
    { id: 'F1', arrivalTime: 0, fileSize: 100, diskLocation: 45 },
    { id: 'F2', arrivalTime: 10, fileSize: 250, diskLocation: 132 },
    { id: 'F3', arrivalTime: 15, fileSize: 50, diskLocation: 20 },
    { id: 'F4', arrivalTime: 30, fileSize: 120, diskLocation: 180 },
    { id: 'F5', arrivalTime: 45, fileSize: 300, diskLocation: 10 }
  ]);

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');
  const [simulationStatus, setSimulationStatus] = useState('idle'); // idle, running, completed
  const [results, setResults] = useState(null);

  const initialHead = 50;
  const totalTracks = 200;

  useEffect(() => {
    let res;
    if (selectedAlgorithm === 'FCFS') res = calculateFCFS(requests, initialHead);
    else if (selectedAlgorithm === 'SSTF') res = calculateSSTF(requests, initialHead);
    else if (selectedAlgorithm === 'SCAN') res = calculateSCAN(requests, initialHead, totalTracks, 'up');

    setResults(res);
  }, [requests, selectedAlgorithm]);

  const handleAddRequest = (req) => {
    setRequests([...requests, { ...req, id: `F${requests.length + 1}` }]);
  };

  const handleClear = () => {
    setRequests([]);
    setSimulationStatus('idle');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">File Transfer Performance Analyzer</h1>
        <p className="text-slate-400 mt-2">Simulate and analyze file transfers using queueing models and disk scheduling.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <InputSection onAdd={handleAddRequest} onClear={handleClear} />

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Scheduling Settings</h2>
            <div className="flex flex-col space-y-3">
              <label className="text-sm text-slate-400">Algorithm</label>
              <select
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="bg-slate-900 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="FCFS">First Come First Serve (FCFS)</option>
                <option value="SSTF">Shortest Seek Time First (SSTF)</option>
                <option value="SCAN">Elevator Algorithm (SCAN)</option>
              </select>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setSimulationStatus('running')}
                  disabled={requests.length === 0 || simulationStatus === 'running'}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                >
                  Start Simulation
                </button>
                <button
                  onClick={() => setSimulationStatus('idle')}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <QueueVisualization requests={requests} results={results} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DiskSimulation
            results={results}
            status={simulationStatus}
            initialHead={initialHead}
            totalTracks={totalTracks}
            onComplete={() => setSimulationStatus('completed')}
          />

          {results && <PerformanceDashboard metrics={results.metrics} />}

          <ComparisonView requests={requests} initialHead={initialHead} totalTracks={totalTracks} />
        </div>
      </div>
    </div>
  );
}
