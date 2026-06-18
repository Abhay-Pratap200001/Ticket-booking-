import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
    },
  },
  { timestamps: true }
);

// one event cannot have two seats with the same seat number
seatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });

export default mongoose.model("Seat", seatSchema);
