"use server";
import { apiFetch } from '@/lib/api-fetch';
import { TransactionDto } from '../dto/response/transaction.dto';
import { ActionType } from '@/lib/enums/action-type.enum';

interface RawTransactionFromBackend {
  id: number;
  node_id: number;
  action_type: ActionType;
  description: string;
  created_at: string;
}

const mapToDto = (raw: RawTransactionFromBackend): TransactionDto => {
  const timeString = new Date(raw.created_at).toLocaleTimeString('en-GB', {
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  });

  return {
    id: raw.id,
    nodeId: raw.node_id,         
    actionType: raw.action_type, 
    description: raw.description,
    timestamp: timeString,       
  };
};

export async function getTransactionLogs(
  limit: number = 50
): Promise<TransactionDto[]> {
  const response = await apiFetch<RawTransactionFromBackend[]>('/transaction', {
    query: { limit },
    cache: 'no-store' 
  });

  if (!response.success || !response.data) {
    throw new Error(response.message || 'Failed to fetch transactions');
  }

  return response.data.map(mapToDto);
}