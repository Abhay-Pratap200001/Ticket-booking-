import Seat from "../models/Seat.js";

// fetches all seats belonging to one event, used to render the seat grid
const getSeatsByEvent = async (req, res) => {
  try {
    const seats = await Seat.find({ eventId: req.params.id }).sort({ seatNumber: 1 });
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seats" });
  }
};

export { getSeatsByEvent };
