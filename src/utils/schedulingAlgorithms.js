export const calculateMetrics = (executionOrder, initialHead) => {
  let currentTime = 0;
  let currentHead = initialHead;
  let totalWaitTime = 0;
  let totalTurnaroundTime = 0;
  let totalSeekTime = 0;

  const results = executionOrder.map((req) => {
    // Arrival wait: The head can only start moving if the request has arrived
    if (currentTime < req.arrivalTime) {
      currentTime = req.arrivalTime;
    }
    
    const seekTime = Math.abs(currentHead - req.diskLocation);
    const startProcessingTime = currentTime;
    
    // Simulate disk reading time: let's assume it takes a constant time proportional to file size
    const transferTime = Math.max(1, Math.floor(req.fileSize / 10)); // Arbitrary unit for simulation
    const completionTime = startProcessingTime + seekTime + transferTime;
    
    const turnaroundTime = completionTime - req.arrivalTime;
    const waitTime = turnaroundTime - transferTime - seekTime; // Wait time before disk head started moving for this file
    
    totalWaitTime += waitTime;
    totalTurnaroundTime += turnaroundTime;
    totalSeekTime += seekTime;

    currentHead = req.diskLocation;
    currentTime = completionTime;

    return {
      ...req,
      seekTime,
      waitTime,
      turnaroundTime,
      completionTime
    };
  });

  const n = executionOrder.length;
  return {
    executionOrder: results,
    metrics: {
      averageWaitTime: n > 0 ? (totalWaitTime / n).toFixed(2) : 0,
      averageTurnaroundTime: n > 0 ? (totalTurnaroundTime / n).toFixed(2) : 0,
      averageSeekTime: n > 0 ? (totalSeekTime / n).toFixed(2) : 0,
      totalTime: currentTime,
      throughput: currentTime > 0 ? (n / currentTime).toFixed(4) : 0
    }
  };
};

export const calculateFCFS = (requests, initialHead) => {
  // FCFS purely sorts by arrival time
  const sorted = [...requests].sort((a, b) => a.arrivalTime - b.arrivalTime);
  return calculateMetrics(sorted, initialHead);
};

export const calculateSSTF = (requests, initialHead) => {
  // Sort by arrival first to handle time progression
  const pending = [...requests].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const executionOrder = [];
  let currentTime = 0;
  let currentHead = initialHead;

  while (pending.length > 0) {
    // Find requests that have arrived by currentTime
    let available = pending.filter(r => r.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      // If no requests have arrived yet, advance time to the next arrival
      currentTime = pending[0].arrivalTime;
      available = pending.filter(r => r.arrivalTime <= currentTime);
    }

    // Find the closest request among available
    let closestIndex = 0;
    let minDistance = Math.abs(currentHead - available[0].diskLocation);

    for (let i = 1; i < available.length; i++) {
      const dist = Math.abs(currentHead - available[i].diskLocation);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    const selected = available[closestIndex];
    executionOrder.push(selected);
    
    // Update head and time
    currentHead = selected.diskLocation;
    const transferTime = Math.max(1, Math.floor(selected.fileSize / 10));
    currentTime += minDistance + transferTime;

    // Remove selected from pending
    const indexInPending = pending.findIndex(r => r.id === selected.id);
    pending.splice(indexInPending, 1);
  }

  return calculateMetrics(executionOrder, initialHead);
};

export const calculateSCAN = (requests, initialHead, totalTracks = 200, direction = 'up') => {
  // Simplistic SCAN implementation
  const pending = [...requests].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const executionOrder = [];
  let currentTime = 0;
  let currentHead = initialHead;
  let currentDir = direction;

  while (pending.length > 0) {
    let available = pending.filter(r => r.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = pending[0].arrivalTime;
      available = pending.filter(r => r.arrivalTime <= currentTime);
    }

    // Find requests in current direction
    let candidates = available.filter(r => 
      currentDir === 'up' ? r.diskLocation >= currentHead : r.diskLocation <= currentHead
    );

    if (candidates.length === 0) {
      // Reached the end or no candidates in this direction, reverse
      currentDir = currentDir === 'up' ? 'down' : 'up';
      // Simulate seeking to the end track before reversing (simplified for visualization)
      const endTrack = currentDir === 'down' ? totalTracks - 1 : 0;
      currentTime += Math.abs(currentHead - endTrack);
      currentHead = endTrack;
      continue;
    }

    // Sort candidates by proximity in current direction
    candidates.sort((a, b) => 
      currentDir === 'up' ? a.diskLocation - b.diskLocation : b.diskLocation - a.diskLocation
    );

    const selected = candidates[0];
    executionOrder.push(selected);
    
    const dist = Math.abs(currentHead - selected.diskLocation);
    currentHead = selected.diskLocation;
    const transferTime = Math.max(1, Math.floor(selected.fileSize / 10));
    currentTime += dist + transferTime;

    const indexInPending = pending.findIndex(r => r.id === selected.id);
    pending.splice(indexInPending, 1);
  }

  return calculateMetrics(executionOrder, initialHead);
};
