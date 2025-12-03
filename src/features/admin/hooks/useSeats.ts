import { useState, useCallback } from 'react';
import { SeatDto } from '@/features/seats/dto/response/seat.dto';

interface UseSeatsResult {
  seats: SeatDto[];
  setSeats: React.Dispatch<React.SetStateAction<SeatDto[]>>;
  updateSeatAvailability: (seatId: string, available: boolean, customerName?: string, bookedByNode?: number) => void;
}

export const useSeats = (initialSeats: SeatDto[] = []): UseSeatsResult => {
  const [seats, setSeats] = useState<SeatDto[]>(initialSeats);

  const updateSeatAvailability = useCallback((seatId: string, available: boolean, customerName?: string, bookedByNode?: number) => {
    setSeats(prev => prev.map(seat =>
      seat.id === seatId
        ? { ...seat, available, customerName, bookedByNode }
        : seat
    ));
  }, []);

  return {
    seats,
    setSeats,
    updateSeatAvailability
  };
};