import { apiFetch } from "@/lib/api-fetch";
import { SeatDto } from '../dto/response/seat.dto';
import { BookSeatRequestDto } from '../dto/request/book-seat.dto';
import { ReleaseSeatRequestDto } from '../dto/request/release-seat.dto';

interface RawSeatFromBackend {
  id: number;
  seat_number: string;
  status: "AVAILABLE" | "BOOKED";
  customer_name?: string | null;
  booked_by_node_id?: number | null;
}

const mapToDto = (raw: RawSeatFromBackend): SeatDto => ({
  id: String(raw.id),
  seatNumber: raw.seat_number,
  available: raw.status === "AVAILABLE",
  customerName: raw.customer_name,
  bookedByNode: raw.booked_by_node_id,
});

export const SeatService = {
  getAll: async (): Promise<SeatDto[]> => {
    const response = await apiFetch<RawSeatFromBackend[]>('/seat'); 
    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to fetch seats');
    }
    return response.data.map(mapToDto);
  },

  book: async (dto: BookSeatRequestDto): Promise<SeatDto> => {
    const response = await apiFetch<RawSeatFromBackend>('/seat/book', {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to book seat');
    }

    return mapToDto(response.data);
  },


  release: async (dto: ReleaseSeatRequestDto): Promise<SeatDto> => {
    const response = await apiFetch<RawSeatFromBackend>('/seat/release', {
        method: 'POST',
        body: JSON.stringify(dto),
    });

    if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to release seat');
    }

    return mapToDto(response.data);
  },
};