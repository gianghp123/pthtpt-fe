
import { apiFetch } from "@/lib/api-fetch";
import { SeatDto } from "../dto/response/seat.dto";

interface RawSeatFromBackend {
  id: number;
  seat_number: string;
  status: "AVAILABLE" | "BOOKED";
  customer_name?: string | null;
  booked_by_node_id?: number | null;
}

export const getAllSeats = async (): Promise<SeatDto[]> => {
  const response = await apiFetch<RawSeatFromBackend[]>("/seat", {
    next: { tags: ["seats"] },
    cache: "no-store",
  });
  if (!response.success || !response.data) {
    throw new Error(response.message || "Failed to fetch seats");
  }

  const mappedSeats: SeatDto[] = response.data.map((item) => ({
    id: String(item.id),
    seatNumber: item.seat_number,
    available: item.status === "AVAILABLE", 
    customerName: item.customer_name,
    bookedByNode: item.booked_by_node_id,
  }));

  return mappedSeats;
};