import { NodeDto } from "@/features/nodes/dto/response/node.dto";
import { killNode, reviveNode } from "@/features/nodes/services/node.action";
import { useCallback, useState, useTransition } from "react";

interface UseNodesResult {
  nodes: NodeDto[];
  error: string | null;
  setNodes: React.Dispatch<React.SetStateAction<NodeDto[]>>;
  handleKillNode: (nodeId: number) => void;
  handleReviveNode: (nodeId: number) => void;
  updateNodeStatus: (
    nodeId: number,
    isAlive: boolean,
    isLeader: boolean
  ) => void;
}

export const useNodes = (initialNodes: NodeDto[] = []): UseNodesResult => {
  const [nodes, setNodes] = useState<NodeDto[]>(initialNodes);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateNodeStatus = useCallback(
    (nodeId: number, isAlive: boolean, isLeader: boolean) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId ? { ...node, isAlive: isAlive, isLeader } : node
        )
      );
    },
    []
  );

  const handleKillNode = useCallback(async (nodeId: number) => {
    startTransition(async () => {
      try {
        setError(null);
        await killNode(nodeId);
        setNodes((prev) =>
          prev.map((node) =>
            node.id === nodeId
              ? { ...node, isAlive: false, isLeader: false }
              : node
          )
        );
      } catch (err: any) {
        console.error("Failed to kill node:", err);
        setError(err.message || "Failed to kill node");
      }
    });
  }, []);

  const handleReviveNode = useCallback(async (nodeId: number) => {
    startTransition(async () => {
      try {
        setError(null);
        await reviveNode(nodeId);
        setNodes((prev) =>
          prev.map((node) =>
            node.id === nodeId ? { ...node, isAlive: true } : node
          )
        );
      } catch (err: any) {
        console.error("Failed to revive node:", err);
        setError(err.message || "Failed to revive node");
      }
    });
  }, []);

  return {
    nodes,
    error,
    setNodes,
    handleKillNode,
    handleReviveNode,
    updateNodeStatus,
  };
};
