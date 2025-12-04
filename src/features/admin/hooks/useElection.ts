import { ElectionRecordDto } from "@/features/election/dto/response/election-record.dto";
import { ElectionStepDto } from "@/features/election/dto/response/election-step.dto";
import { useSocket } from "@/lib/context/socket-client.context";
import { ElectionStepType } from "@/lib/enums/election-step-type.enum";
import { SocketChannel } from "@/lib/enums/socket-channel.enum";
import { useEffect, useState } from "react";

interface ElectionResult {
  electionSteps: ElectionStepDto[];
  newLeaderId: number | null;
  isElecting: boolean;
  electionHistory: ElectionRecordDto[];
  showHistoryModal: boolean;
  setShowHistoryModal: (show: boolean) => void;
}

export const useElection = (): ElectionResult => {
  const [electionSteps, setElectionSteps] = useState<ElectionStepDto[]>([]);
  const [newLeaderId, setNewLeaderId] = useState<number | null>(null);
  const [isElecting, setIsElecting] = useState(false);
  const [electionHistory, setElectionHistory] = useState<ElectionRecordDto[]>(
    []
  );
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;
    socket.on(SocketChannel.ELECTION, (msg: ElectionStepDto) => {
      setIsElecting((currentIsElecting) => {
        if (!currentIsElecting) {
          return true; // Start election only if it hasn't started
        }
        return currentIsElecting; // Otherwise, keep it true
      });
      console.log("Election msg", msg);
      setElectionSteps((prev) => [...prev, msg]);
      if (msg.type === ElectionStepType.VICTORY) {
        setNewLeaderId(msg.nodeId);
        setIsElecting(false);
      }
    });

    return () => {
      socket?.off(SocketChannel.ELECTION);
    };
  }, [socket, isConnected]);

  return {
    electionSteps,
    newLeaderId,
    isElecting,
    electionHistory,
    showHistoryModal,
    setShowHistoryModal,
  };
};
