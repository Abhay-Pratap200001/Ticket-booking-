import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Event from "../models/Event.js";
import Seat from "../models/Seat.js";

// creates a few sample events with seats so the app has data to show on first run
const seedDatabase = async () => {
  await connectDB();

  await Event.deleteMany();
  await Seat.deleteMany();

  const sampleEvents = [
    {
      name: "Coldplay Live in Concert",
      dateTime: new Date("2026-08-15T19:00:00"),
      venue: "DY Patil Stadium, Mumbai",
      totalSeats: 20,
    },
    {
      name: "Stand-Up Comedy Night",
      dateTime: new Date("2026-07-10T20:00:00"),
      venue: "Phoenix Arena, Bangalore",
      totalSeats: 12,
    },
    {
      name: "Tech Conference 2026",
      dateTime: new Date("2026-09-01T09:00:00"),
      venue: "Convention Centre, Delhi",
      totalSeats: 16,
    },
  ];

  for (const eventData of sampleEvents) {
    const createdEvent = await Event.create(eventData);

    const seatsToInsert = [];
    for (let i = 1; i <= eventData.totalSeats; i++) {
      seatsToInsert.push({
        eventId: createdEvent._id,
        seatNumber: `S${i}`,
        status: "available",
      });
    }

    await Seat.insertMany(seatsToInsert);
    console.log(`Created event "${createdEvent.name}" with ${eventData.totalSeats} seats`);
  }

  console.log("Seeding finished successfully");
  mongoose.connection.close();
};

seedDatabase();
