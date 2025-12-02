import { apiFetch } from "@/lib/api-fetch";
import { ToggleSystemRequestDto } from '../dto/request/toggle-system.dto';

export const SystemService = {
  toggle: async (dto: ToggleSystemRequestDto): Promise<void> => {
    const response = await apiFetch<void>('/system/toggle', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
    if (!response.success) {
        throw new Error(response.message || 'Failed to toggle system');
    }
  },
};
