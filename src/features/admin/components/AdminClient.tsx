"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ElectionHistoryModal } from "@/features/admin/components/ElectionHistoryModal";
import { ElectionModal } from "@/features/admin/components/ElectionModal";
import { NodeCard } from "@/features/admin/components/NodeCard";
import { SeatCard } from "@/features/admin/components/SeatCard";
import { TransactionLog } from "@/features/admin/components/TransactionLog";
import { useElection } from "@/features/admin/hooks/useElection";
import { useSeats } from "@/features/admin/hooks/useSeats";
import { useTransactions } from "@/features/admin/hooks/useTransactions";
import { NodeDto } from "@/features/nodes/dto/response/node.dto";
import { useNodes } from "@/features/nodes/hooks/useNodes";
import { SeatDto } from "@/features/seats/dto/response/seat.dto";
// THAY ĐỔI 1: Import Action thay vì Service
import { toggleSystemAction } from "@/features/system/services/system.action"; 
import { TransactionDto } from "@/features/transaction_logs/dto/response/transaction.dto";
import { useSocket } from "@/lib/context/socket-client.context";
import { ActionType } from "@/lib/enums/action-type.enum";
import { Combine, History, Power } from "lucide-react";
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
  const { socket } = useSocket();

  // --- Hooks Management ---
  const {
    nodes,
    setNodes,
    handleKillNode: originalHandleKillNode,
    handleReviveNode: originalHandleReviveNode,
  } = useNodes(initialNodes);

  const { seats, setSeats, updateSeatAvailability } = useSeats(initialSeats);

  const {
    transactions,
    addTransaction,
  } = useTransactions();

  // Initialize transactions just once
  useEffect(() => {
    if (transactions.length === 0 && initialTransactions.length > 0) {
      initialTransactions.forEach((t) => addTransaction(t));
    }
  }, [initialTransactions, addTransaction, transactions.length]);

  const {
    electionSteps,
    newLeaderId,
    electionHistory,
  } = useElection();

  // --- Real-time Socket Listeners ---
  useEffect(() => {
    if (!socket) return;

    const handleBuySeat = (data: any) => {
      if (data?.seatId) {
        updateSeatAvailability(data.seatId, false, data.customerName, data.nodeId);
        
        addTransaction({
          id: Date.now(),
          timestamp: getCurrentTime(),
          nodeId: data.nodeId || 0,
          actionType: ActionType.BUY,
          description: `Customer ${data.customerName || 'Unknown'} bought Seat ${data.seatId}`,
        });
      }
    };

    const handleReleaseSeat = (data: any) => {
      if (data?.seatId) {
        updateSeatAvailability(data.seatId, true);
        
        addTransaction({
          id: Date.now(),
          timestamp: getCurrentTime(),
          nodeId: data.nodeId || 0,
          actionType: ActionType.RELEASE,
          description: `Seat ${data.seatId} was released`,
        });
      }
    };

    const handleKillNodeEvent = (data: { nodeId: number }) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === Number(data.nodeId)
            ? { ...node, isAlive: false, isLeader: false }
            : node
        )
      );
      addTransaction({
        id: Date.now(),
        timestamp: getCurrentTime(),
        nodeId: Number(data.nodeId),
        actionType: ActionType.KILL,
        description: `Node ${data.nodeId} was killed (Socket event)`,
      });
    };

    const handleReviveNodeEvent = (data: { nodeId: number }) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === Number(data.nodeId) ? { ...node, isAlive: true } : node
        )
      );
      addTransaction({
        id: Date.now(),
        timestamp: getCurrentTime(),
        nodeId: Number(data.nodeId),
        actionType: ActionType.REVIVE,
        description: `Node ${data.nodeId} was revived (Socket event)`,
      });
    };

    socket.on(ActionType.BUY, handleBuySeat);
    socket.on(ActionType.RELEASE, handleReleaseSeat);
    socket.on(ActionType.KILL, handleKillNodeEvent);
    socket.on(ActionType.REVIVE, handleReviveNodeEvent);

    return () => {
      socket.off(ActionType.BUY, handleBuySeat);
      socket.off(ActionType.RELEASE, handleReleaseSeat);
      socket.off(ActionType.KILL, handleKillNodeEvent);
      socket.off(ActionType.REVIVE, handleReviveNodeEvent);
    };
  }, [socket, updateSeatAvailability, setNodes, addTransaction]);


  // --- Logic Helpers ---

  useEffect(() => {
    if (newLeaderId !== null) {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          isLeader: node.id === newLeaderId,
          isAlive: node.id === newLeaderId ? true : node.isAlive
        }))
      );
      
      addTransaction({
        id: Date.now(),
        timestamp: getCurrentTime(),
        nodeId: newLeaderId,
        actionType: ActionType.ELECTION,
        description: `Node ${newLeaderId} elected as NEW LEADER`,
      });
    }
  }, [newLeaderId, setNodes, addTransaction]);

  // THAY ĐỔI 2: Sử dụng toggleSystemAction thay vì SystemService.toggle
  const handleToggleSystem = async () => {
    try {
      const newState = !systemActive;
      setSystemActive(newState);
      // Gọi Server Action
      const result = await toggleSystemAction({ active: newState });
      
      if (!result.success) {
         console.error("Failed to toggle system:", result.message);
         setSystemActive(!newState); // Revert nếu lỗi
      }
    } catch (error) {
      console.error("Failed to toggle system:", error);
      setSystemActive(!systemActive);
    }
  };

  const handleKillNode = useCallback(
    (nodeId: number) => {
      originalHandleKillNode(nodeId);
    },
    [originalHandleKillNode]
  );

  const handleReviveNode = useCallback(
    (nodeId: number) => {
      originalHandleReviveNode(nodeId);
    },
    [originalHandleReviveNode]
  );

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().split(" ")[0];
  };

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
            onClick={handleToggleSystem}
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

      {/* Election Modal & History */}
      <div className="fixed bottom-16 right-16 flex flex-col gap-2">
        <Dialog>
          <DialogTrigger className=" bg-purple-500/30 border-2 border-purple-300/50 text-white px-6 py-3 rounded-2xl backdrop-blur-md hover:bg-purple-500/40 transition-all shadow-lg flex items-center gap-2">
            <Combine className="w-5 h-5" /> Election Steps
          </DialogTrigger>
          <DialogTitle></DialogTitle>
          <DialogContent className="bg-transparent p-0 border-none">
            <ElectionModal
              electionSteps={electionSteps}
              newLeaderId={newLeaderId}
            />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className=" bg-purple-500/30 border-2 border-purple-300/50 text-white px-6 py-3 rounded-2xl backdrop-blur-md hover:bg-purple-500/40 transition-all shadow-lg flex items-center gap-2">
            <History className="w-5 h-5" />
            <span>Election History</span>
          </DialogTrigger>
          <DialogTitle></DialogTitle>
          <DialogContent className="bg-transparent p-0 border-none">
            <ElectionHistoryModal elections={electionHistory} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}