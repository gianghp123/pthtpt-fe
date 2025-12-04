import { useState, useCallback } from 'react';
import { NodeDto } from '@/features/nodes/dto/response/node.dto';
import { NodeService } from '@/features/nodes/services/node.service';

interface UseNodesResult {
  nodes: NodeDto[];
  setNodes: React.Dispatch<React.SetStateAction<NodeDto[]>>;
  handleKillNode: (nodeId: number) => void;
  handleReviveNode: (nodeId: number) => void;
  updateNodeStatus: (nodeId: number, alive: boolean, isLeader: boolean) => void;
}
const [error, setError] = useState<string | null>(null);

export const useNodes = (initialNodes: NodeDto[] = []): UseNodesResult => {
  const [nodes, setNodes] = useState<NodeDto[]>(initialNodes);

  const updateNodeStatus = useCallback((nodeId: number, alive: boolean, isLeader: boolean) => {
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive, isLeader } : node
    ));
  }, []);

  const handleKillNode = useCallback(async(nodeId: number) => {
    try{
      setError(null);
      await NodeService.kill(nodeId);
      setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive: false, isLeader: false } : node
      ));
    } catch (err : any) {
      console.error('Failed to kill node:', err);
      setError(err.message || 'Failed to kill node');
    }
  }, []);

  const handleReviveNode = useCallback(async(nodeId: number) => {
    try{
      setError(null);
      await NodeService.revive(nodeId);
      setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive: true } : node
      ));
    }catch (err : any) {
      console.error('Failed to revive node:', err);
      setError(err.message || 'Failed to revive node');
    }
  }, []);

  return {
    nodes,
    setNodes,
    handleKillNode,
    handleReviveNode,
    updateNodeStatus
  };
};