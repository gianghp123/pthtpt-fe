"use client";
import { Armchair, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SeatDto } from "@/features/seats/dto/response/seat.dto";
import { useSeats } from "@/features/seats/hooks/useSeats";

interface SeatPickerClientProps {
  initialSeats: SeatDto[];
}

export default function SeatPickerClient({ initialSeats }: SeatPickerClientProps) {
  const { seats, handleBookSeat, handleReleaseSeat, isPending } = useSeats(initialSeats);

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [myBookedSeats, setMyBookedSeats] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMySeats, setShowMySeats] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const getSeatStatusData = (seatNumberStr: string) => {
    return seats.find(s => s.seatNumber === seatNumberStr);
  };

  const rows = ['A', 'B', 'C', 'D'];
  const getSeatLabel = (index: number) => {
    const row = rows[Math.floor((index - 1) / 8)];
    const col = ((index - 1) % 8) + 1;
    return `${row}${col}`;
  };

  useEffect(() => {
    const storedMyBooked = localStorage.getItem("myBookedSeats");
    if (storedMyBooked) setMyBookedSeats(JSON.parse(storedMyBooked));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("myBookedSeats", JSON.stringify(myBookedSeats));
    }
  }, [myBookedSeats, isLoaded]);

  const handleSeatClick = (seatNumberStr: string) => {
    const seatData = getSeatStatusData(seatNumberStr);
    
    const isAvailable = seatData ? seatData.available : false;

    if (isAvailable) {
      setSelectedSeat(seatNumberStr);
      setShowModal(true);
    }
  };

  const confirmBooking = async () => {
    if (!selectedSeat) return;

    const success = await handleBookSeat(selectedSeat, "Test");
    
    if (success) {
      setMyBookedSeats((prev) => [...prev, selectedSeat]);
      setShowModal(false);
      setSelectedSeat(null);
    } else {
      alert("Đặt vé thất bại! Ghế đã bị người khác đặt.");
      setShowModal(false);
    }
  };

  const cancelBooking = () => {
    setShowModal(false);
    setSelectedSeat(null);
  };

  const removeBookedSeat = async (seatNumberStr: string) => {
    const success = await handleReleaseSeat(seatNumberStr);
    if (success) {
      setMyBookedSeats((prev) => prev.filter((s) => s !== seatNumberStr));
    } else {
      alert("Hủy vé thất bại.");
    }
  };

  const getSeatStyle = (seatNumberStr: string) => {
    const seatData = getSeatStatusData(seatNumberStr);
    const isAvailable = seatData ? seatData.available : false;
    const isMySeat = myBookedSeats.includes(seatNumberStr);

    if (isMySeat) return "bg-emerald-500 text-white cursor-not-allowed shadow-emerald-200";
    if (!isAvailable) return "bg-slate-300 text-slate-500 cursor-not-allowed"; // Ghế đã bị người khác đặt
    if (selectedSeat === seatNumberStr) return "bg-amber-400 text-white shadow-amber-200 scale-110 ring-4 ring-amber-200";
    
    return "bg-white text-slate-400 hover:bg-indigo-50 hover:text-indigo-500 hover:shadow-indigo-200 cursor-pointer hover:-translate-y-1";
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 font-sans">
      <div>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Select Your Seat
            </h1>
            <p className="text-slate-500 text-lg">
              Experience the movie in comfort and style
            </p>
          </header>

          <div className="mb-16 relative perspective-1000">
            <div className="h-16 w-3/4 mx-auto bg-linear-to-b from-indigo-500/20 to-transparent rounded-t-[50%] transform rotate-x-12 shadow-[0_20px_50px_-10px_rgba(99,102,241,0.3)] border-t border-indigo-200/50 backdrop-blur-sm"></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-indigo-300 text-sm font-medium tracking-[0.5em] uppercase">
              Screen
            </div>
          </div>

          <div className="grid grid-cols-8 gap-3 md:gap-5 mb-12 max-w-3xl mx-auto">
            {Array.from({ length: 32 }, (_, i) => i + 1).map((index) => {
              const seatLabel = getSeatLabel(index); // A1, A2...
              // Check API xem ghế có bị người khác đặt chưa (để disable nút)
              const seatData = getSeatStatusData(seatLabel);
              const isBookedByOthers = seatData && !seatData.available && !myBookedSeats.includes(seatLabel);

              return (
                <button
                  key={index}
                  onClick={() => handleSeatClick(seatLabel)}
                  disabled={!!isBookedByOthers || isPending}
                  className={`
                    relative group flex items-center justify-center p-3 rounded-2xl transition-all duration-300 shadow-lg
                    ${getSeatStyle(seatLabel)}
                  `}
                >
                  <Armchair size={28} strokeWidth={2.5} />
                  <span className="absolute -bottom-2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white px-2 py-0.5 rounded-full">
                    {seatLabel}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 border-t border-slate-100 pt-8">
            {[
              { label: "Available", color: "bg-white border border-slate-200", iconColor: "text-slate-400" },
              { label: "My Seats", color: "bg-emerald-500", iconColor: "text-white" },
              { label: "Booked", color: "bg-slate-300", iconColor: "text-slate-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${item.color} shadow-sm`}>
                  <Armchair size={16} className={item.iconColor} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowMySeats(true)}
        className="fixed bottom-8 right-8 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 group z-40"
      >
        <div className="relative">
          <Armchair size={24} />
          {myBookedSeats.length > 0 && (
            <span className="absolute -top-3 -right-3 bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-900">
              {myBookedSeats.length}
            </span>
          )}
        </div>
      </button>

      {showMySeats && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                My Tickets
              </h2>
              <button
                onClick={() => setShowMySeats(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-8 max-h-[50vh] overflow-y-auto">
              {myBookedSeats.length > 0 ? (
                <div className="space-y-3">
                  {myBookedSeats.map((seat) => (
                    <div
                      key={seat}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                          <Armchair size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">Seat Number</p>
                          <p className="text-lg font-bold text-slate-900">{seat}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBookedSeat(seat)}
                        disabled={isPending}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Armchair size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">No tickets booked yet</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowMySeats(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
            >
              Back to Booking
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
              <Armchair size={40} />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Confirm Selection
            </h2>
            <p className="text-slate-500 mb-8">
              Are you sure you want to book seat <strong className="text-slate-900">#{selectedSeat}</strong>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelBooking}
                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
              >
                {isPending ? "Booking..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}