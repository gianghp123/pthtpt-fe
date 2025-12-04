
import { getAllSeats } from "@/features/seats/services/seat.get";
import SeatPickerClient from "@/features/seats/components/SeatPickerClient";

export default async function SeatPickerPage() {
  const initialSeats = await getAllSeats();

  return <SeatPickerClient initialSeats={initialSeats} />;
}