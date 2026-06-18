import Seat from "./Seat.jsx";

const LEGEND_ITEMS = [
  { label: "Available", colorClass: "bg-green-500" },
  { label: "Selected", colorClass: "bg-indigo-600" },
  { label: "Reserved", colorClass: "bg-yellow-400" },
  { label: "Booked", colorClass: "bg-gray-400" },
];

// extracts the numeric part of a seat number like "S12" so seats sort 1, 2, 3 ... instead of alphabetically
const getSeatNumberValue = (seatNumber) => {
  const digitsOnly = seatNumber.replace(/\D/g, "");
  return Number(digitsOnly) || 0;
};

// shows all seats for an event in a grid and a small legend explaining the colors
const SeatGrid = ({ seats, selectedSeats, onSelectSeat }) => {
  const sortedSeats = [...seats].sort(
    (firstSeat, secondSeat) => getSeatNumberValue(firstSeat.seatNumber) - getSeatNumberValue(secondSeat.seatNumber)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800">Select Your Seats</h2>
        <div className="flex flex-wrap gap-4">
          {LEGEND_ITEMS.map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-3.5 h-3.5 rounded ${item.colorClass}`}></span>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-4">
        {sortedSeats.map((seat) => (
          <Seat
            key={seat._id}
            seat={seat}
            isSelected={selectedSeats.includes(seat.seatNumber)}
            onSelectSeat={onSelectSeat}
          />
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
