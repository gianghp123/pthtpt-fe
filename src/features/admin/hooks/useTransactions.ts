import { useState, useCallback, useEffect } from 'react';
import { TransactionDto } from '@/features/transaction_logs/dto/response/transaction.dto';
import { getTransactionLogs } from '@/features/transaction_logs/services/transaction.service';
interface UseTransactionsResult {
  transactions: TransactionDto[];
  loading: boolean;
  error: string | null;
  fetchRecent: () => Promise<void>;
  addTransaction: (transaction: TransactionDto) => void;
  clearTransactions: () => void;
}

export const useTransactions = (limit: number = 50): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecent = useCallback(async () => {
    try{
      setLoading(true);
      setError(null);
      const data = await getTransactionLogs(limit);
      setTransactions(data);
    } catch (err){
      console.error('Failed to fetch transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally{
      setLoading(false);
    }
  }, [limit]);

  const addTransaction = useCallback((transaction: TransactionDto) => {
    setTransactions(prev => [transaction, ...prev].slice(0, limit)); // Keep last 50 transactions
  }, [limit]);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchRecent,
    addTransaction,
    clearTransactions
  };
};