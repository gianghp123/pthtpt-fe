export interface Seat {
    id: number;
    seat_number: string;
    status: 'AVAILABLE' | 'BOOKED';
    customer_name: string | null;
    booked_by_node_id: number | null;
}

export interface BookSeatRequest {
    seatId: number;
    customerName: string;
}

export interface ReleaseSeatRequest {
    seatId: number;
}
