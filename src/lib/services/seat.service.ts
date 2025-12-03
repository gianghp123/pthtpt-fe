import { apiFetch } from '../api-fetch';
import { Seat, BookSeatRequest, ReleaseSeatRequest } from '../typedefs/seat';

export const SeatService = {
    getAllSeats: async () => {
        return await apiFetch<Seat[]>('/seat');
    },

    bookSeat: async (data: BookSeatRequest) => {
        return await apiFetch<Seat>('/seat/book', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    releaseSeat: async (data: ReleaseSeatRequest) => {
        return await apiFetch<Seat>('/seat/release', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
