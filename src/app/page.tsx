"use client";
import { X } from "lucide-react";
import { useState } from "react";

export default function SeatPicker() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [myBookedSeats, setMyBookedSeats] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMySeats, setShowMySeats] = useState(false);

  const handleSeatClick = (seatNumber: number) => {
    if (!bookedSeats.includes(seatNumber)) {
      setSelectedSeat(seatNumber);
      setShowModal(true);
    }
  };

  const confirmBooking = () => {
    if (!selectedSeat) return;
    setBookedSeats([...bookedSeats, selectedSeat]);
    setMyBookedSeats([...myBookedSeats, selectedSeat]);
    setShowModal(false);
    setSelectedSeat(null);
  };

  const cancelBooking = () => {
    setShowModal(false);
    setSelectedSeat(null);
  };

  const getSeatStatus = (seatNumber: number) => {
    if (myBookedSeats.includes(seatNumber)) return "my-booked";
    if (bookedSeats.includes(seatNumber)) return "booked";
    if (selectedSeat === seatNumber) return "selected";
    return "available";
  };

  const getSeatColor = (seatNumber: number) => {
    const status = getSeatStatus(seatNumber);
    if (status === "my-booked") return "bg-green-500 cursor-not-allowed";
    if (status === "booked") return "bg-gray-400 cursor-not-allowed";
    if (status === "selected") return "bg-yellow-400 hover:bg-yellow-500";
    return "bg-blue-500 hover:bg-blue-600 cursor-pointer";
  };

  const removeBookedSeat = (seatNumber: number) => {
    setMyBookedSeats(myBookedSeats.filter((s) => s !== seatNumber));
    setBookedSeats(bookedSeats.filter((s) => s !== seatNumber));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-8">
      <div className="bg-white backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Select Your Seat
        </h1>

        {/* Screen */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-t-full h-2 w-3/4 mx-auto mb-2"></div>
          <p className="text-purple-600 text-center text-sm">Screen</p>
        </div>

        {/* Seats Grid */}
        <div className="grid grid-cols-8 gap-4 mb-8">
          {Array.from({ length: 32 }, (_, i) => i + 1).map((seatNumber) => (
            <button
              key={seatNumber}
              onClick={() => handleSeatClick(seatNumber)}
              className={`${getSeatColor(
                seatNumber
              )} text-white font-semibold py-4 rounded-lg transition-all transform hover:scale-105 active:scale-95`}
              disabled={bookedSeats.includes(seatNumber)}
            >
              {seatNumber}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-sm">My Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded"></div>
            <span className="text-sm">Booked</span>
          </div>
        </div>
      </div>

      {/* Floating Button - My Booked Seats */}
      <button
        onClick={() => setShowMySeats(true)}
        className="fixed bottom-8 right-8 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2"
      >
        <span className="text-lg">My Seats ({myBookedSeats.length || 0})</span>
      </button>

      {/* My Seats Modal */}
      {showMySeats && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                My Booked Seats
              </h2>
              <button
                onClick={() => setShowMySeats(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                {myBookedSeats.length > 0
                  ? "You have booked the following seats:"
                  : "You have not booked any seats yet."}
              </p>
              <div className="grid grid-cols-4 gap-3">
                {myBookedSeats.map((seat) => (
                  <div
                    key={seat}
                    className="relative bg-linear-to-r from-green-500 to-emerald-600 text-white text-xl font-bold rounded-lg py-4 text-center"
                  >
                    {seat}

                    {/* Delete seat button */}
                    <button
                      onClick={() => removeBookedSeat(seat)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-lg p-1 shadow-md"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMySeats(false)}
              className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Confirm Booking
              </h2>
              <button
                onClick={cancelBooking}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You have selected seat number:
              </p>
              <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white text-4xl font-bold rounded-lg py-6 text-center">
                {selectedSeat}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelBooking}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
