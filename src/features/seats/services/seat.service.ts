import { apiFetch } from "@/lib/api-fetch";
import { SeatDto } from '../dto/response/seat.dto';
import { BookSeatRequestDto } from '../dto/request/book-seat.dto';
import { ReleaseSeatRequestDto } from '../dto/request/release-seat.dto';

export const SeatService = {
  getAll: async (): Promise<SeatDto[]> => {
    const response = await apiFetch<SeatDto[]>('/seats');
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch seats');
    }
    return response.data;
  },
  book: async (dto: BookSeatRequestDto): Promise<SeatDto> => {
    const response = await apiFetch<SeatDto>('/seats/book', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to book seat');
    }
    return response.data;
  },
  release: async (dto: ReleaseSeatRequestDto): Promise<SeatDto> => {
    const response = await apiFetch<SeatDto>('/seats/release', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to release seat');
    }
    return response.data;
  },
};
