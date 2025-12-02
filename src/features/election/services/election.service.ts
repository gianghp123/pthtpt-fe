import { apiFetch } from '@/lib/api-fetch';
import { ElectionRecordDto } from '../dto/response/election-record.dto';

export const ElectionService = {
  getHistory: async (limit: number = 50): Promise<ElectionRecordDto[]> => {
    const response = await apiFetch<ElectionRecordDto[]>('/elections/history', {
        query: { limit }
    });
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch election history');
    }
    return response.data;
  },
};
