import { useState, useCallback } from 'react';
import { NodeDto } from '@/features/nodes/dto/response/node.dto';

const API_BASE_URL = '/api';
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

  const handleKillNode = useCallback(async(nodeId: number) => {
    try{
      const res = await fetch(`${API_BASE_URL}/node/${nodeId}/kill`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
      });

      if(!res.ok){
        throw new Error(`Failed to kill node with id ${nodeId}`);
      }
      //update state UI
      setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive: false, isLeader: false } : node
    ));
    }catch(err){
      console.error(err);
    }
  }, []);

  const handleReviveNode = useCallback(async(nodeId: number) => {
    try{
      const res = await fetch(`${API_BASE_URL}/node/${nodeId}/revive`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" }
      });
      if(!res.ok){
        throw new Error(`Failed to revive node with id ${nodeId}`);
      }
    setNodes(prev => prev.map(node =>
      node.id === nodeId ? { ...node, alive: true } : node
    ));
    }catch(err){
      console.error(err);
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