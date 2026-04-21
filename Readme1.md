 Project Overview

The File Transfer Performance Analyzer is a simulation-based system that evaluates file transfer efficiency using queueing models and disk scheduling algorithms.
It helps analyze how different algorithms affect system performance in terms of waiting time, turnaround time, and overall efficiency.

 Problem Statement

In modern systems, multiple file transfer requests arrive simultaneously, causing delays and inefficient resource usage.
This project aims to simulate and optimize file transfer performance by applying queueing models and disk scheduling techniques.

 Features
 Input file transfer requests (manual or file input)
 Queue simulation (FCFS model)
 Disk scheduling algorithms:
FCFS (First Come First Serve)
SSTF (Shortest Seek Time First)
SCAN (Elevator Algorithm)
 Performance metrics calculation:
Waiting Time
Turnaround Time
Seek Time
Throughput
 Algorithm comparison dashboard
 Technologies Used
Java (Core Programming)
File Handling (BufferedReader, FileReader)
Basic Data Structures (Queue, List)
 System Architecture
Input → Queue → Scheduling Algorithm → Disk Processing → Performance Metrics → Output
🔹 Queueing Model Used

M/M/1 Queue Model

Single server (disk)
Random arrival of file requests
Sequential processing
 How It Works
User inputs file transfer data
Requests are stored in a queue
Selected scheduling algorithm is applied
Disk processes files in order
System calculates performance metrics
 Sample Input
ID  ArrivalTime  FileSize
1   0            5
2   1            3
3   2            8
 Sample Output
File   WT   TAT
1      0    5
2      4    7
3      6    14

Average Waiting Time = 5.75
Average Turnaround Time = 11.25
 Real-Time Applications
Cloud storage systems
File transfer protocols (FTP)
Operating system disk scheduling
Data centers and server optimization
 Novelty
Combines queueing theory and disk scheduling
Provides simulation and performance comparison
Helps identify the most efficient algorithm
 Future Enhancements
Add graphical visualization (charts & dashboards)
Implement real-time simulation UI
Integrate AI-based prediction
Extend to multi-disk systems (M/M/c)
