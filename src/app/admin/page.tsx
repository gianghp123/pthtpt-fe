'use client'
import { useState, useEffect } from 'react';
import { NodeCard } from '@/components/NodeCard';
import { SeatCard } from '@/components/SeatCard';
import { TransactionLog } from '@/components/TransactionLog';
import { ElectionModal } from '@/components/ElectionModal';
import { ElectionHistoryModal } from '@/components/ElectionHistoryModal';
import { Power, History } from 'lucide-react';

interface Node {
  id: number;
  alive: boolean;
  isLeader: boolean;
}

interface Seat {
  id: string;
  seatNumber: string;
  available: boolean;
  customerName?: string;
  bookedByNode?: number;
}

interface Transaction {
  id: number;
  timestamp: string;
  nodeId: number;
  actionType: 'LOCK' | 'BUY' | 'RELEASE' | 'ELECTION' | 'HEARTBEAT';
  description: string;
}

interface ElectionStep {
  nodeId: number;
  message: string;
  type: 'candidate' | 'election' | 'victory';
}

interface ElectionRecord {
  id: number;
  timestamp: string;
  oldLeaderId: number | null;
  newLeaderId: number;
  candidates: number[];
  reason: string;
}

export default function App() {
  const [systemActive, setSystemActive] = useState(true);
  const [isElecting, setIsElecting] = useState(false);
  const [electionSteps, setElectionSteps] = useState<ElectionStep[]>([]);
  const [newLeaderId, setNewLeaderId] = useState<number | null>(null);
  const [electionHistory, setElectionHistory] = useState<ElectionRecord[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, alive: true, isLeader: false },
    { id: 2, alive: true, isLeader: false },
    { id: 3, alive: true, isLeader: true },
    { id: 4, alive: true, isLeader: false },
    { id: 5, alive: true, isLeader: false },
    { id: 6, alive: true, isLeader: false },
  ]);

  const [seats, setSeats] = useState<Seat[]>([
    { id: '1', seatNumber: 'A1', available: true },
    { id: '2', seatNumber: 'A2', available: false, customerName: 'Jane Doe', bookedByNode: 3 },
    { id: '3', seatNumber: 'A3', available: true },
    { id: '4', seatNumber: 'A4', available: false, customerName: 'John Smith', bookedByNode: 1 },
    { id: '5', seatNumber: 'A5', available: true },
    { id: '6', seatNumber: 'B1', available: true },
    { id: '7', seatNumber: 'B2', available: false, customerName: 'Alice Johnson', bookedByNode: 5 },
    { id: '8', seatNumber: 'B3', available: true },
    { id: '9', seatNumber: 'B4', available: true },
    { id: '10', seatNumber: 'B5', available: false, customerName: 'Bob Wilson', bookedByNode: 2 },
    { id: '11', seatNumber: 'C1', available: true },
    { id: '12', seatNumber: 'C2', available: true },
    { id: '13', seatNumber: 'C3', available: false, customerName: 'Carol White', bookedByNode: 4 },
    { id: '14', seatNumber: 'C4', available: true },
    { id: '15', seatNumber: 'C5', available: true },
    { id: '16', seatNumber: 'D1', available: false, customerName: 'David Brown', bookedByNode: 6 },
    { id: '17', seatNumber: 'D2', available: true },
    { id: '18', seatNumber: 'D3', available: true },
    { id: '19', seatNumber: 'D4', available: false, customerName: 'Emma Davis', bookedByNode: 3 },
    { id: '20', seatNumber: 'D5', available: true },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, timestamp: '14:32:15', nodeId: 3, actionType: 'BUY', description: 'Customer Jane Doe bought Seat A2' },
    { id: 2, timestamp: '14:32:18', nodeId: 1, actionType: 'LOCK', description: 'Node 1 locked Seat A4' },
    { id: 3, timestamp: '14:32:20', nodeId: 1, actionType: 'BUY', description: 'Customer John Smith bought Seat A4' },
    { id: 4, timestamp: '14:32:25', nodeId: 5, actionType: 'BUY', description: 'Customer Alice Johnson bought Seat B2' },
    { id: 5, timestamp: '14:32:30', nodeId: 3, actionType: 'HEARTBEAT', description: 'Leader Node 3 sent heartbeat' },
  ]);

  const handleKillNode = (nodeId: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, alive: false, isLeader: false } : node
    ));
    
    // Trigger election if killed node was leader
    const killedNode = nodes.find(n => n.id === nodeId);
    if (killedNode?.isLeader) {
      setTimeout(() => electNewLeader(nodeId), 500);
    }

    addTransaction({
      id: Date.now(),
      timestamp: getCurrentTime(),
      nodeId: nodeId,
      actionType: 'ELECTION',
      description: `Node ${nodeId} has been terminated`,
    });
  };

  const handleReviveNode = (nodeId: number) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, alive: true } : node
    ));

    addTransaction({
      id: Date.now(),
      timestamp: getCurrentTime(),
      nodeId: nodeId,
      actionType: 'HEARTBEAT',
      description: `Node ${nodeId} has been revived`,
    });
  };

  const electNewLeader = (oldLeaderId: number) => {
    // Start election process
    setIsElecting(true);
    setElectionSteps([]);
    setNewLeaderId(null);

    // Bully algorithm: select highest ID among alive nodes
    const aliveNodes = nodes.filter(n => n.alive && n.id !== oldLeaderId);
    
    if (aliveNodes.length === 0) {
      setIsElecting(false);
      return;
    }

    // Simulate election steps
    const steps: ElectionStep[] = [];
    
    // Step 1: Announce candidates
    aliveNodes.forEach((node, index) => {
      setTimeout(() => {
        const step: ElectionStep = {
          nodeId: node.id,
          message: `Node ${node.id} is a candidate for leadership`,
          type: 'candidate',
        };
        setElectionSteps(prev => [...prev, step]);
      }, index * 400);
    });

    // Step 2: Election messages
    const sortedNodes = [...aliveNodes].sort((a, b) => b.id - a.id);
    sortedNodes.forEach((node, index) => {
      setTimeout(() => {
        const step: ElectionStep = {
          nodeId: node.id,
          message: `Node ${node.id} sends election message (ID: ${node.id})`,
          type: 'election',
        };
        setElectionSteps(prev => [...prev, step]);
      }, (aliveNodes.length * 400) + (index * 400));
    });

    // Step 3: Determine winner
    const newLeader = aliveNodes.reduce((max, node) => node.id > max.id ? node : max);
    
    setTimeout(() => {
      const step: ElectionStep = {
        nodeId: newLeader.id,
        message: `Node ${newLeader.id} has the highest ID and wins the election!`,
        type: 'victory',
      };
      setElectionSteps(prev => [...prev, step]);
      setNewLeaderId(newLeader.id);
      setIsElecting(false);
      
      // Update leader status
      setNodes(prev => prev.map(node => ({
        ...node,
        isLeader: node.id === newLeader.id && node.alive,
      })));

      addTransaction({
        id: Date.now() + 1,
        timestamp: getCurrentTime(),
        nodeId: newLeader.id,
        actionType: 'ELECTION',
        description: `Node ${newLeader.id} elected as new leader (Bully Algorithm)`,
      });

      // Record election history
      const electionRecord: ElectionRecord = {
        id: Date.now(),
        timestamp: getCurrentTime(),
        oldLeaderId: oldLeaderId,
        newLeaderId: newLeader.id,
        candidates: aliveNodes.map(n => n.id),
        reason: `Node ${oldLeaderId} was terminated`,
      };
      setElectionHistory(prev => [electionRecord, ...prev].slice(0, 50)); // Keep last 50 records
    }, (aliveNodes.length * 400) + (sortedNodes.length * 400) + 400);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev].slice(0, 50)); // Keep last 50 transactions
  };

  // Simulate some activity
  useEffect(() => {
    if (!systemActive) return;

    const interval = setInterval(() => {
      const aliveNodes = nodes.filter(n => n.alive);
      if (aliveNodes.length === 0) return;

      const randomNode = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
      const leader = nodes.find(n => n.isLeader);

      if (leader && Math.random() > 0.7) {
        addTransaction({
          id: Date.now(),
          timestamp: getCurrentTime(),
          nodeId: leader.id,
          actionType: 'HEARTBEAT',
          description: `Leader Node ${leader.id} sent heartbeat`,
        });
      } else if (Math.random() > 0.5) {
        const availableSeats = seats.filter(s => s.available);
        if (availableSeats.length > 0 && Math.random() > 0.3) {
          const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
          const customerNames = ['Michael Lee', 'Sarah Connor', 'Tom Hardy', 'Lisa Ray', 'Chris Evans'];
          const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
          
          setSeats(prev => prev.map(seat =>
            seat.id === randomSeat.id
              ? { ...seat, available: false, customerName, bookedByNode: randomNode.id }
              : seat
          ));

          addTransaction({
            id: Date.now(),
            timestamp: getCurrentTime(),
            nodeId: randomNode.id,
            actionType: 'BUY',
            description: `Customer ${customerName} bought Seat ${randomSeat.seatNumber}`,
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [systemActive, nodes, seats]);

  return (
    <div className="min-h-screen w-full max-w-[1600px] mx-auto">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white mb-2">Distributed System Monitor</h1>
            <p className="text-white/80">Bully Algorithm • Real-time Node Coordination</p>
          </div>
          
          {/* System Status Toggle */}
          <button
            onClick={() => setSystemActive(!systemActive)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border backdrop-blur-md transition-all ${
              systemActive
                ? 'bg-green-500/20 border-green-300/50 text-white'
                : 'bg-red-500/20 border-red-300/50 text-white'
            }`}
          >
            <Power className="w-5 h-5" />
            System {systemActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        {/* Main Content Card Wrapper */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Top Section: Node Cluster Status */}
          <div className="mb-8">
            <h2 className="text-white mb-4">Node Cluster Status</h2>
            <div className="grid grid-cols-6 gap-4">
              {nodes.map(node => (
                <NodeCard
                  key={node.id}
                  node={node}
                  onKill={handleKillNode}
                  onRevive={handleReviveNode}
                />
              ))}
            </div>
          </div>

          {/* Middle Section: Cinema Seat Map */}
          <div className="mb-8">
            <h2 className="text-white mb-4">Cinema Seat Map (Distributed Database)</h2>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6">
              <div className="grid grid-cols-5 gap-4">
                {seats.map(seat => (
                  <SeatCard key={seat.id} seat={seat} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section: Live Transaction Logs */}
          <div>
            <h2 className="text-white mb-4">Live Transaction Logs</h2>
            <TransactionLog transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Election Modal */}
      <ElectionModal
        isElecting={isElecting}
        electionSteps={electionSteps}
        newLeaderId={newLeaderId}
      />

      {/* Election History Modal */}
      <ElectionHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        elections={electionHistory}
      />

      {/* History Button */}
      <button
        onClick={() => setShowHistoryModal(true)}
        className="fixed bottom-8 right-8 bg-purple-500/30 border-2 border-purple-300/50 text-white px-6 py-3 rounded-2xl backdrop-blur-md hover:bg-purple-500/40 transition-all shadow-lg flex items-center gap-2"
      >
        <History className="w-5 h-5" />
        <span>Election History</span>
        {electionHistory.length > 0 && (
          <span className="bg-yellow-400/80 text-purple-900 px-2 py-0.5 rounded-lg text-xs">
            {electionHistory.length}
          </span>
        )}
      </button>
    </div>
  );
}