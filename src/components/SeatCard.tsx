import { SeatDto } from "@/features/seats/dto/response/seat.dto";

interface SeatCardProps {
  seat: SeatDto;
}

export function SeatCard({ seat }: SeatCardProps) {
  return (
    <div
      className={`rounded-2xl p-4 border transition-all ${
        seat.available
          ? 'bg-white/50 border-white/40'
          : 'bg-purple-900/90 border-purple-700/50'
      }`}
    >
      {/* Seat Number */}
      <div className="text-center mb-2">
        <p className={`text-lg ${seat.available ? 'text-gray-800' : 'text-white'}`}>
          {seat.seatNumber}
        </p>
      </div>

      {/* Status */}
      <div className="text-center">
        {seat.available ? (
          <span className="text-xs text-gray-600">Available</span>
        ) : (
          <div className="space-y-1">
            <p className="text-xs text-white/90">{seat.customerName}</p>
            <span className="inline-block px-2 py-0.5 bg-purple-500/40 border border-purple-400/50 rounded-lg text-xs text-white/80">
              via Node {seat.bookedByNode}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
