import mongoose from "mongoose";
import Seat from "../models/Seat.js";
import Reservation from "../models/Reservation.js";

const RESERVATION_MINUTES = Number(process.env.RESERVATION_MINUTES) || 10;

// reserves the requested seats for 10 minutes if every seat is still available
// uses a query filter on status so two users cannot grab the same seat at once
const reserveSeats = async (req, res) => {
  try {
    const { eventId, seatNumbers } = req.body;
    const userId = req.userId;

    if (!eventId || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: "eventId and seatNumbers are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid eventId" });
    }

    // each findOneAndUpdate below is atomic, so two requests racing for the
    // same seat can never both succeed for that seat
    const reservedSeatIds = [];
    let allSeatsReserved = true;

    for (const seatNumber of seatNumbers) {
      const seat = await Seat.findOneAndUpdate(
        { eventId, seatNumber, status: "available" },
        { $set: { status: "reserved" } },
        { new: true }
      );

      if (!seat) {
        allSeatsReserved = false;
        break;
      }

      reservedSeatIds.push(seat._id);
    }

    if (!allSeatsReserved) {
      // undo only the seats this request just reserved, leave other seats untouched
      await Seat.updateMany(
        { _id: { $in: reservedSeatIds } },
        { $set: { status: "available" } }
      );
      return res.status(409).json({ message: "One or more selected seats are no longer available" });
    }

    const expiresAt = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);

    const reservation = await Reservation.create({
      userId,
      eventId,
      seatNumbers,
      expiresAt,
    });

    res.status(201).json({
      reservationId: reservation._id,
      expiresAt: reservation.expiresAt,
      seatNumbers: reservation.seatNumbers,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to reserve seats" });
  }
};

export { reserveSeats };
