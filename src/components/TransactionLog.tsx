interface Transaction {
  id: number;
  timestamp: string;
  nodeId: number;
  actionType: 'LOCK' | 'BUY' | 'RELEASE' | 'ELECTION' | 'HEARTBEAT';
  description: string;
}

interface TransactionLogProps {
  transactions: Transaction[];
}

const getActionColor = (actionType: string) => {
  switch (actionType) {
    case 'BUY':
      return 'bg-green-500/80 text-white';
    case 'LOCK':
      return 'bg-yellow-500/80 text-white';
    case 'RELEASE':
      return 'bg-blue-500/80 text-white';
    case 'ELECTION':
      return 'bg-purple-500/80 text-white';
    case 'HEARTBEAT':
      return 'bg-pink-500/80 text-white';
    default:
      return 'bg-gray-500/80 text-white';
  }
};

const getNodeColor = (nodeId: number) => {
  const colors = [
    'bg-cyan-500/80',
    'bg-blue-500/80',
    'bg-indigo-500/80',
    'bg-violet-500/80',
    'bg-fuchsia-500/80',
    'bg-rose-500/80',
  ];
  return colors[(nodeId - 1) % colors.length];
};

export function TransactionLog({ transactions }: TransactionLogProps) {
  return (
    <div className="backdrop-blur-md border border-white/30 rounded-3xl p-6">
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full">
          <thead className="sticky top-0 bg-white/10 backdrop-blur-sm">
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-purple-950 text-sm">Time</th>
              <th className="text-left py-3 px-4 text-purple-950 text-sm">Source</th>
              <th className="text-left py-3 px-4 text-purple-950 text-sm">Action</th>
              <th className="text-left py-3 px-4 text-purple-950 text-sm">Message</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-white/10 hover:bg-white/10 transition-colors"
              >
                <td className="py-3 px-4 text-purple-950/80 text-sm font-mono">
                  {transaction.timestamp}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs text-white ${getNodeColor(
                      transaction.nodeId
                    )}`}
                  >
                    Node {transaction.nodeId}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs ${getActionColor(
                      transaction.actionType
                    )}`}
                  >
                    {transaction.actionType}
                  </span>
                </td>
                <td className="py-3 px-4 text-purple-950/80 text-sm">
                  {transaction.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {transactions.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}
