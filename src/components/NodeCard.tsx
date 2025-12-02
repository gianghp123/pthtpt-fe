import { Crown, Circle } from 'lucide-react';

interface Node {
  id: number;
  alive: boolean;
  isLeader: boolean;
}

interface NodeCardProps {
  node: Node;
  onKill: (nodeId: number) => void;
  onRevive: (nodeId: number) => void;
}

export function NodeCard({ node, onKill, onRevive }: NodeCardProps) {
  return (
    <div
      className={`backdrop-blur-sm border rounded-3xl p-4 transition-all ${
        node.isLeader
          ? 'border-yellow-600/80 shadow-lg shadow-yellow-600/20 animate-pulse-slow'
          : 'border-white/50'
      }`}
      style={{
        animation: node.isLeader ? 'pulse-slow 3s ease-in-out infinite' : 'none',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Circle
            className={`w-3 h-3 ${
              node.alive ? 'fill-green-400 text-green-400' : 'fill-gray-400 text-gray-400'
            }`}
            style={{
              filter: node.alive ? 'drop-shadow(0 0 4px rgba(74, 222, 128, 0.8))' : 'none',
            }}
          />
          <span className="text-purple-950">Node {node.id}</span>
        </div>
        
        {node.isLeader && (
          <Crown className="w-5 h-5 text-yellow-600" />
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <p className="text-xs text-purple-950/70 mb-1">Status</p>
        <p className="text-sm text-purple-950">
          {node.alive ? 'Alive' : 'Dead'}
        </p>
        <p className="text-xs text-purple-950/70 mt-1">
          {node.isLeader ? 'Leader' : 'Follower'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onKill(node.id)}
          disabled={!node.alive}
          className={`px-3 py-2 rounded-xl border-2 text-xs transition-all ${
            node.alive
              ? 'border-red-400 bg-red-500/30 text-red-950 hover:bg-red-500/50'
              : 'border-gray-500/50 bg-gray-500/20 text-gray-400 cursor-not-allowed'
          }`}
        >
          Kill Node
        </button>
        <button
          onClick={() => onRevive(node.id)}
          disabled={node.alive}
          className={`px-3 py-2 rounded-xl border-2 text-xs transition-all ${
            !node.alive
              ? 'border-green-400 bg-green-500/30 text-green-950 hover:bg-green-500/50'
              : 'border-gray-500/50 bg-gray-500/20 text-gray-400 cursor-not-allowed'
          }`}
        >
          Revive
        </button>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.02);
          }
        }
      `}</style>
    </div>
  );
}