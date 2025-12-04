// src/features/seats/hooks/useSeats.ts
import { useState, useCallback, useTransition, useEffect } from "react";
import { SeatDto } from "../dto/response/seat.dto";
import { bookSeatAction, releaseSeatAction } from "../services/seat.action";

interface UseSeatsResult {
  seats: SeatDto[];
  isPending: boolean;
  error: string | null;
  handleBookSeat: (seatId: string, customerName: string) => Promise<boolean>;
  handleReleaseSeat: (seatId: string) => Promise<boolean>;
  setSeats: React.Dispatch<React.SetStateAction<SeatDto[]>>;
}

export const useSeats = (initialSeats: SeatDto[] = []): UseSeatsResult => {
  const [seats, setSeats] = useState<SeatDto[]>(initialSeats);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSeats(initialSeats);
  }, [initialSeats]);

  const handleBookSeat = useCallback(async (seatId: string, customerName: string) => {
    let isSuccess = false;
    // Dùng startTransition để không block UI
    await new Promise<void>((resolve) => {
        startTransition(async () => {
            setError(null);
            const result = await bookSeatAction({ seatId, customerName });
            
            if (result.success && result.data) {
                // Optimistic update hoặc cập nhật từ kết quả trả về
                setSeats((prev) =>
                    prev.map((seat) =>
                        seat.seatNumber === seatId ? result.data! : seat
                    )
                );
                isSuccess = true;
            } else {
                setError(result.message || "Booking failed");
            }
            resolve();
        });
    });
    return isSuccess;
  }, []);

  const handleReleaseSeat = useCallback(async (seatId: string) => {
      let isSuccess = false;
      await new Promise<void>((resolve) => {
        startTransition(async () => {
            setError(null);
            const result = await releaseSeatAction({ seatId });

            if (result.success && result.data) {
                setSeats((prev) =>
                    prev.map((seat) =>
                        seat.seatNumber === seatId ? result.data! : seat
                    )
                );
                isSuccess = true;
            } else {
                setError(result.message || "Release failed");
            }
            resolve();
        });
      });
      return isSuccess;
  }, []);

  return {
    seats,
    isPending,
    error,
    setSeats,
    handleBookSeat,
    handleReleaseSeat,
  };
};