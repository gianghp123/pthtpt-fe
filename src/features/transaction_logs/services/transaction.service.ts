import { apiFetch } from '@/lib/api-fetch';
import { TransactionDto } from '../dto/response/transaction.dto';

export const TransactionService = {
  getRecent: async (limit: number = 50): Promise<TransactionDto[]> => {
    const response = await apiFetch<TransactionDto[]>('/transactions', {
        query: { limit }
    });
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch transactions');
    }
    return response.data;
  },
};
