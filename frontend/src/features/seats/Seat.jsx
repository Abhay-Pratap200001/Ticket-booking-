// renders a single seat button, color depends on status and whether it is selected
const Seat = ({ seat, isSelected, onSelectSeat }) => {
  // decides the background color class for the seat based on its current state
  const getSeatColorClass = () => {
    if (seat.status === "booked") return "bg-gray-400 cursor-not-allowed text-white";
    if (seat.status === "reserved") return "bg-yellow-400 cursor-not-allowed text-white";
    if (isSelected) return "bg-indigo-600 text-white";
    return "bg-green-500 hover:bg-green-600 text-white";
  };

  const isClickable = seat.status === "available";

  return (
    <button
      type="button"
      disabled={!isClickable}
      onClick={() => onSelectSeat(seat.seatNumber)}
      className={`w-14 h-14 rounded-xl text-sm font-semibold flex items-center justify-center shadow-sm transition ${getSeatColorClass()}`}
    >
      {seat.seatNumber}
    </button>
  );
};

export default Seat;
