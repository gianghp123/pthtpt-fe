"use client";
import { ElectionHistoryModal } from "@/features/admin/components/ElectionHistoryModal";
import { ElectionModal } from "@/features/admin/components/ElectionModal";
import { NodeCard } from "@/features/admin/components/NodeCard";
import { SeatCard } from "@/features/admin/components/SeatCard";
import { TransactionLog } from "@/features/admin/components/TransactionLog";
import { useElection } from "@/features/admin/hooks/useElection";
import { useNodes } from "@/features/admin/hooks/useNodes";
import { useSeats } from "@/features/admin/hooks/useSeats";
import { useTransactions } from "@/features/admin/hooks/useTransactions";
import { NodeDto } from "@/features/nodes/dto/response/node.dto";
import { SeatDto } from "@/features/seats/dto/response/seat.dto";
import { TransactionDto } from "@/features/transaction_logs/dto/response/transaction.dto";
import { ActionType } from "@/lib/enums/action-type.enum";
import { History, Power } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AdminClientProps {
  initialNodes: NodeDto[];
  initialSeats: SeatDto[];
  initialTransactions: TransactionDto[];
}

export default function AdminClient({
  initialNodes,
  initialSeats,
  initialTransactions,
}: AdminClientProps) {
  const [systemActive, setSystemActive] = useState(true);

  console.log('admin page')

  // Use our custom hooks
  const {
    nodes,
    setNodes,
    handleKillNode: originalHandleKillNode,
    handleReviveNode: originalHandleReviveNode,
    updateNodeStatus,
  } = useNodes(initialNodes);

  const { seats, setSeats, updateSeatAvailability } = useSeats(initialSeats);

  const {
    transactions,
    addTransaction: originalAddTransaction,
    clearTransactions,
  } = useTransactions();

  // Set initial transactions
  useEffect(() => {
    // Only set initial transactions once
    if (transactions.length === 0) {
      initialTransactions.forEach((transaction) => {
        originalAddTransaction(transaction);
      });
    }
  }, [transactions.length, initialTransactions, originalAddTransaction]);

  const {
    electionSteps,
    newLeaderId,
    isElecting,
    electionHistory,
    showHistoryModal,
    // electNewLeader,
    setShowHistoryModal,
  } = useElection();

  // Enhance the kill node function with election triggering
  const handleKillNode = useCallback(
    (nodeId: number) => {
      originalHandleKillNode(nodeId);

      // Trigger election if killed node was leader
      const killedNode = nodes.find((n) => n.id === nodeId);
      // if (killedNode?.isLeader) {
      //   setTimeout(() => electNewLeader(nodeId), 500);
      // }

      originalAddTransaction({
        id: Date.now(),
        timestamp: getCurrentTime(),
        nodeId: nodeId,
        actionType: ActionType.ELECTION,
        description: `Node ${nodeId} has been terminated`,
      });
    },
    [nodes, originalAddTransaction, originalHandleKillNode]
  );

  const handleReviveNode = useCallback(
    (nodeId: number) => {
      originalHandleReviveNode(nodeId);

      originalAddTransaction({
        id: Date.now(),
        timestamp: getCurrentTime(),
        nodeId: nodeId,
        actionType: ActionType.HEARTBEAT,
        description: `Node ${nodeId} has been revived`,
      });
    },
    [originalAddTransaction, originalHandleReviveNode]
  );

  const getCurrentTime = useCallback(() => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  }, []);

  // Simulate some activity
  // useEffect(() => {
  //   if (!systemActive) return;

  //   const interval = setInterval(() => {
  //     const aliveNodes = nodes.filter((n) => n.alive);
  //     if (aliveNodes.length === 0) return;

  //     const randomNode =
  //       aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
  //     const leader = nodes.find((n) => n.isLeader);

  //     if (leader && Math.random() > 0.7) {
  //       originalAddTransaction({
  //         id: Date.now(),
  //         timestamp: getCurrentTime(),
  //         nodeId: leader.id,
  //         actionType: ActionType.HEARTBEAT,
  //         description: `Leader Node ${leader.id} sent heartbeat`,
  //       });
  //     } else if (Math.random() > 0.5) {
  //       const availableSeats = seats.filter((s) => s.available);
  //       if (availableSeats.length > 0 && Math.random() > 0.3) {
  //         const randomSeat =
  //           availableSeats[Math.floor(Math.random() * availableSeats.length)];
  //         const customerNames = [
  //           "Michael Lee",
  //           "Sarah Connor",
  //           "Tom Hardy",
  //           "Lisa Ray",
  //           "Chris Evans",
  //         ];
  //         const customerName =
  //           customerNames[Math.floor(Math.random() * customerNames.length)];

  //         updateSeatAvailability(
  //           randomSeat.id,
  //           false,
  //           customerName,
  //           randomNode.id
  //         );

  //         originalAddTransaction({
  //           id: Date.now(),
  //           timestamp: getCurrentTime(),
  //           nodeId: randomNode.id,
  //           actionType: ActionType.BUY,
  //           description: `Customer ${customerName} bought Seat ${randomSeat.seatNumber}`,
  //         });
  //       }
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [
  //   systemActive,
  //   nodes,
  //   seats,
  //   originalAddTransaction,
  //   getCurrentTime,
  //   updateSeatAvailability,
  // ]);

  return (
    <div className="min-h-screen w-full max-w-[1600px] mx-auto">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-white mb-2 text-2xl">Admin Dashboard</h1>
            <p className="text-white/80">
              Bully Algorithm • Real-time Node Coordination
            </p>
          </div>

          {/* System Status Toggle */}
          <button
            onClick={() => setSystemActive(!systemActive)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border backdrop-blur-md transition-all ${
              systemActive
                ? "bg-green-500/20 border-green-300/50 text-white"
                : "bg-red-500/20 border-red-300/50 text-white"
            }`}
          >
            <Power className="w-5 h-5" />
            System {systemActive ? "Active" : "Inactive"}
          </button>
        </div>

        {/* Main Content Card Wrapper */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Top Section: Node Cluster Status */}
          <div className="mb-8">
            <h2 className="text-white mb-4">Node Cluster Status</h2>
            <div className="grid grid-cols-6 gap-4">
              {nodes.map((node) => (
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
            <h2 className="text-white mb-4">
              Cinema Seat Map (Distributed Database)
            </h2>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6">
              <div className="grid grid-cols-5 gap-4">
                {seats.map((seat) => (
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
