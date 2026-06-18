import Seat from "./Seat.jsx";

// shows all seats for an event in a grid and a small legend explaining the colors
const SeatGrid = ({ seats, selectedSeats, onSelectSeat }) => {
  return (
    <div>
      <div className="flex gap-5 mb-5 text-sm text-gray-600">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-500 inline-block rounded"></span> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-indigo-600 inline-block rounded"></span> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-yellow-400 inline-block rounded"></span> Reserved
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-400 inline-block rounded"></span> Booked
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-4">
        {seats.map((seat) => (
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
