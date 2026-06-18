import Event from "../models/Event.js";

// fetches all events sorted by date, newest event first
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// fetches a single event by its mongo id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event details" });
  }
};

export { getAllEvents, getEventById };
