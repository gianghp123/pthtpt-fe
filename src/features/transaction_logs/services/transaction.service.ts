"use server";
import { apiFetch } from '@/lib/api-fetch';
import { TransactionDto } from '../dto/response/transaction.dto';

export async function getTransactionLogs(
  limit: number = 50
): Promise<TransactionDto[]> {
  const response = await apiFetch<TransactionDto[]>('/transaction', {
    query: { limit },
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to fetch transactions');
  }

  return response.data;
}