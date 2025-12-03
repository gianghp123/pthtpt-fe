export interface SeatDto {
  id: string;
  seatNumber: string;
  available: boolean;
  customerName?: string | null;
  bookedByNode?: number | null;
}
