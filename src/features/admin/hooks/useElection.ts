import { useState, useCallback } from 'react';
import { NodeDto } from '@/features/nodes/dto/response/node.dto';
import { ElectionStepDto } from '@/features/election/dto/response/election-step.dto';
import { ElectionRecordDto } from '@/features/election/dto/response/election-record.dto';
import { TransactionDto } from '@/features/transaction_logs/dto/response/transaction.dto';
import { ActionType } from '@/lib/enums/action-type.enum';

interface UseElectionProps {
  nodes: NodeDto[];
  seats: any[]; // Using any for now since the type isn't clear from the context
  addTransaction: (transaction: TransactionDto) => void;
  updateNodeStatus: (nodeId: number, alive: boolean, isLeader: boolean) => void;
}

interface ElectionResult {
  electionSteps: ElectionStepDto[];
  newLeaderId: number | null;
  isElecting: boolean;
  electionHistory: ElectionRecordDto[];
  showHistoryModal: boolean;
  electNewLeader: (oldLeaderId: number) => void;
  setShowHistoryModal: (show: boolean) => void;
}

export const useElection = ({
  nodes,
  seats,
  addTransaction,
  updateNodeStatus
}: UseElectionProps): ElectionResult => {
  const [electionSteps, setElectionSteps] = useState<ElectionStepDto[]>([]);
  const [newLeaderId, setNewLeaderId] = useState<number | null>(null);
  const [isElecting, setIsElecting] = useState(false);
  const [electionHistory, setElectionHistory] = useState<ElectionRecordDto[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const getCurrentTime = useCallback(() => {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
  }, []);

  const electNewLeader = useCallback((oldLeaderId: number) => {
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
    const steps: ElectionStepDto[] = [];

    // Step 1: Announce candidates
    aliveNodes.forEach((node, index) => {
      setTimeout(() => {
        const step: ElectionStepDto = {
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
        const step: ElectionStepDto = {
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
      const step: ElectionStepDto = {
        nodeId: newLeader.id,
        message: `Node ${newLeader.id} has the highest ID and wins the election!`,
        type: 'victory',
      };
      setElectionSteps(prev => [...prev, step]);
      setNewLeaderId(newLeader.id);
      setIsElecting(false);

      // Update leader status
      updateNodeStatus(newLeader.id, true, true);

      addTransaction({
        id: Date.now() + 1,
        timestamp: getCurrentTime(),
        nodeId: newLeader.id,
        actionType: ActionType.ELECTION,
        description: `Node ${newLeader.id} elected as new leader (Bully Algorithm)`,
      });

      // Record election history
      const electionRecord: ElectionRecordDto = {
        id: Date.now(),
        timestamp: getCurrentTime(),
        oldLeaderId: oldLeaderId,
        newLeaderId: newLeader.id,
        candidates: aliveNodes.map(n => n.id),
        reason: `Node ${oldLeaderId} was terminated`,
      };
      setElectionHistory(prev => [electionRecord, ...prev].slice(0, 50)); // Keep last 50 records
    }, (aliveNodes.length * 400) + (sortedNodes.length * 400) + 400);
  }, [addTransaction, getCurrentTime, nodes, updateNodeStatus]);

  return {
    electionSteps,
    newLeaderId,
    isElecting,
    electionHistory,
    showHistoryModal,
    electNewLeader,
    setShowHistoryModal
  };
};