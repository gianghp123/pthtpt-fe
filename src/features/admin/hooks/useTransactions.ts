import { useState, useCallback } from 'react';
import { TransactionDto } from '@/features/transaction_logs/dto/response/transaction.dto';

interface UseTransactionsResult {
  transactions: TransactionDto[];
  addTransaction: (transaction: TransactionDto) => void;
  clearTransactions: () => void;
}

export const useTransactions = (): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<TransactionDto[]>([]);

  const addTransaction = useCallback((transaction: TransactionDto) => {
    console.log(transaction.id)
    setTransactions(prev => [transaction, ...prev].slice(0, 50)); // Keep last 50 transactions
  }, []);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    transactions,
    addTransaction,
    clearTransactions
  };
};