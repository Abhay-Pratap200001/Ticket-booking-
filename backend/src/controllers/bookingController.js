import mongoose from "mongoose";
import Seat from "../models/Seat.js";
import Reservation from "../models/Reservation.js";

// confirms a booking by marking reserved seats as booked and deleting the reservation
// rejects the request if the reservation has expired or does not belong to the user
const confirmBooking = async (req, res) => {
  try {
    const { reservationId } = req.body;
    const userId = req.userId;

    if (!reservationId || !mongoose.Types.ObjectId.isValid(reservationId)) {
      return res.status(400).json({ message: "Valid reservationId is required" });
    }

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found or already expired" });
    }

    if (reservation.userId.toString() !== userId) {
      return res.status(403).json({ message: "This reservation does not belong to you" });
    }

    if (reservation.expiresAt.getTime() < Date.now()) {
      await Reservation.findByIdAndDelete(reservationId);
      return res.status(410).json({ message: "Reservation has expired, please reserve again" });
    }

    await Seat.updateMany(
      { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers } },
      { $set: { status: "booked" } }
    );

    await Reservation.findByIdAndDelete(reservationId);

    res.status(200).json({
      message: "Booking confirmed successfully",
      eventId: reservation.eventId,
      seatNumbers: reservation.seatNumbers,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

export { confirmBooking };
