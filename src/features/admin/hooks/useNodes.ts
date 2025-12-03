import { useState, useCallback } from 'react';
import { NodeDto } from '@/features/nodes/dto/response/node.dto';

interface UseNodesResult {
  nodes: NodeDto[];
  setNodes: React.Dispatch<React.SetStateAction<NodeDto[]>>;
  handleKillNode: (nodeId: number) => void;
  handleReviveNode: (nodeId: number) => void;
  updateNodeStatus: (nodeId: number, alive: boolean, isLeader: boolean) => void;
}

export const useNodes = (initialNodes: NodeDto[] = []): UseNodesResult => {
  const [nodes, setNodes] = useState<NodeDto[]>(initialNodes);

  const updateNodeStatus = useCallback((nodeId: number, alive: boolean, isLeader: boolean) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive, isLeader } : node
    ));
  }, []);

  const handleKillNode = useCallback((nodeId: number) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive: false, isLeader: false } : node
    ));
  }, []);

  const handleReviveNode = useCallback((nodeId: number) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive: true } : node
    ));
  }, []);

  return {
    nodes,
    setNodes,
    handleKillNode,
    handleReviveNode,
    updateNodeStatus
  };
};