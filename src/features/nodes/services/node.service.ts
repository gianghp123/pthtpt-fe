import { apiFetch } from "@/lib/api-fetch";
import { NodeDto } from '../dto/response/node.dto';

export const NodeService = {
  getAll: async (): Promise<NodeDto[]> => {
    const response = await apiFetch<NodeDto[]>('/node');
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch nodes');
    }
    return response.data;
  },
  kill: async (id: number): Promise<void> => {
    const response = await apiFetch<void>(`/node/${id}/kill`, {
        method: 'POST'
    });
    if (!response.success) {
        throw new Error(response.message || 'Failed to kill node');
    }
  },
  revive: async (id: number): Promise<void> => {
    const response = await apiFetch<void>(`/node/${id}/revive`, {
        method: 'POST'
    });
    if (!response.success) {
        throw new Error(response.message || 'Failed to revive node');
    }
  },
};
