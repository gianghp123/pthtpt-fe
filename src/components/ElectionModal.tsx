import { ElectionStepDto } from '@/features/election/dto/response/election-step.dto';
import { Crown, Zap, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ElectionModalProps {
  isElecting: boolean;
  electionSteps: ElectionStepDto[];
  newLeaderId: number | null;
}

export function ElectionModal({ isElecting, electionSteps, newLeaderId }: ElectionModalProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isElecting) {
      setVisible(true);
    } else if (newLeaderId !== null) {
      // Keep visible for 2 more seconds after election completes
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isElecting, newLeaderId]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white/20 backdrop-blur-xl border-2 border-yellow-400/50 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
          <h2 className="text-white text-center">
            {isElecting ? 'Leader Election in Progress' : 'Election Complete'}
          </h2>
          <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
        </div>

        <p className="text-center text-white/80 mb-6">
          Bully Algorithm - Highest Node ID Wins
        </p>

        {/* Election Steps */}
        <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
          {electionSteps.map((step, index) => (
            <div
              key={index}
              className={`bg-white/10 backdrop-blur-sm border rounded-2xl p-4 transition-all ${
                step.type === 'victory'
                  ? 'border-yellow-400/70 bg-yellow-400/20'
                  : step.type === 'election'
                  ? 'border-purple-400/50 bg-purple-500/20'
                  : 'border-blue-400/50 bg-blue-500/20'
              }`}
              style={{
                animation: 'slideIn 0.3s ease-out',
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'backwards',
              }}
            >
              <div className="flex items-center gap-3">
                {step.type === 'victory' ? (
                  <Crown className="w-6 h-6 text-yellow-400 shrink-0" />
                ) : step.type === 'election' ? (
                  <Zap className="w-6 h-6 text-purple-400 shrink-0" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-blue-400 shrink-0" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-white/20 rounded-lg text-xs text-white">
                      Node {step.nodeId}
                    </span>
                    {step.type === 'victory' && (
                      <span className="px-2 py-0.5 bg-yellow-400/30 border border-yellow-400/50 rounded-lg text-xs text-yellow-300">
                        NEW LEADER
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/90">{step.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Victory Banner */}
        {!isElecting && newLeaderId !== null && (
          <div className="bg-linear-to-r from-yellow-400/30 via-yellow-500/30 to-yellow-400/30 border-2 border-yellow-400/70 rounded-2xl p-6 text-center animate-pulse-slow">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white text-xl mb-2">Node {newLeaderId} is the New Leader!</h3>
            <p className="text-white/80 text-sm">Election completed successfully</p>
          </div>
        )}

        {/* Loading indicator during election */}
        {isElecting && (
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
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
    </div>
  );
}
