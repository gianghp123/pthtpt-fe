import { Crown, X, Clock, Zap } from 'lucide-react';

interface ElectionRecord {
  id: number;
  timestamp: string;
  oldLeaderId: number | null;
  newLeaderId: number;
  candidates: number[];
  reason: string;
}

interface ElectionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  elections: ElectionRecord[];
}

export function ElectionHistoryModal({ isOpen, onClose, elections }: ElectionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-7 h-7 text-white" />
            <h2 className="text-white">Election History</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <p className="text-white/80 mb-6">
          Complete history of all leader elections using the Bully Algorithm
        </p>

        {/* Elections List */}
        <div className="overflow-y-auto max-h-[calc(80vh-200px)] space-y-4">
          {elections.length === 0 ? (
            <div className="text-center py-12 bg-white/10 rounded-2xl border border-white/20">
              <Zap className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60">No elections have occurred yet</p>
              <p className="text-white/40 text-sm mt-2">Kill a leader node to trigger an election</p>
            </div>
          ) : (
            elections.map((election, index) => (
              <div
                key={election.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                {/* Election Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/30 border border-purple-400/50 rounded-xl p-2">
                      <Zap className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="text-white">
                        Election #{elections.length - index}
                      </h3>
                      <p className="text-white/60 text-sm">{election.timestamp}</p>
                    </div>
                  </div>
                  
                  {/* New Leader Badge */}
                  <div className="bg-yellow-400/20 border-2 border-yellow-400/50 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Node {election.newLeaderId}</span>
                  </div>
                </div>

                {/* Election Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Previous Leader</p>
                    <p className="text-white">
                      {election.oldLeaderId ? `Node ${election.oldLeaderId}` : 'None'}
                    </p>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">New Leader</p>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <p className="text-white">Node {election.newLeaderId}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Candidates</p>
                    <p className="text-white">{election.candidates.length} nodes</p>
                  </div>
                </div>

                {/* Candidates List */}
                <div className="mb-3">
                  <p className="text-white/60 text-xs mb-2">Participating Nodes:</p>
                  <div className="flex flex-wrap gap-2">
                    {election.candidates.sort((a, b) => b - a).map(nodeId => (
                      <span
                        key={nodeId}
                        className={`px-3 py-1 rounded-lg text-xs border ${
                          nodeId === election.newLeaderId
                            ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-300'
                            : 'bg-blue-500/20 border-blue-400/50 text-blue-300'
                        }`}
                      >
                        Node {nodeId}
                        {nodeId === election.newLeaderId && ' 👑'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Trigger Event</p>
                  <p className="text-white/90 text-sm">{election.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {elections.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-white/60 text-xs mb-1">Total Elections</p>
                <p className="text-white text-xl">{elections.length}</p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Current Leader</p>
                <p className="text-white text-xl">
                  Node {elections[0]?.newLeaderId || '-'}
                </p>
              </div>
              <div>
                <p className="text-white/60 text-xs mb-1">Most Elected</p>
                <p className="text-white text-xl">
                  Node {getMostElectedNode(elections)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getMostElectedNode(elections: ElectionRecord[]): number {
  if (elections.length === 0) return 0;
  
  const counts = elections.reduce((acc, election) => {
    acc[election.newLeaderId] = (acc[election.newLeaderId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return Number(Object.entries(counts).reduce((max, [nodeId, count]) => 
    count > (counts[Number(max)] || 0) ? nodeId : max
  , '0'));
}
