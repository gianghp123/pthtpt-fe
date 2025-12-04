import { ElectionRecordDto } from "@/features/election/dto/response/election-record.dto";
import { ElectionStepDto } from "@/features/election/dto/response/election-step.dto";
import { useSocket } from "@/lib/context/socket-client.context";
import { ElectionStepType } from "@/lib/enums/election-step-type.enum";
import { SocketChannel } from "@/lib/enums/socket-channel.enum";
import { useEffect, useState } from "react";

interface ElectionResult {
  electionSteps: ElectionStepDto[];
  newLeaderId: number | null;
  electionHistory: ElectionRecordDto[];
}

export const useElection = (): ElectionResult => {
  const [electionSteps, setElectionSteps] = useState<ElectionStepDto[]>([]);
  const [newLeaderId, setNewLeaderId] = useState<number | null>(null);
  const [electionHistory, setElectionHistory] = useState<ElectionRecordDto[]>(
    []
  );
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;
    socket.on(SocketChannel.ELECTION, (msg: ElectionStepDto) => {
      console.log("Election msg", msg);
      setElectionSteps((prev) => [...prev, msg]);
      if (msg.type === ElectionStepType.VICTORY) {
        setNewLeaderId(msg.nodeId);
      }
    });

    return () => {
      socket?.off(SocketChannel.ELECTION);
    };
  }, [socket, isConnected]);

  return {
    electionSteps,
    newLeaderId,
    electionHistory,
  };
};
