import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import EventCard from "./EventCard.jsx";

// loads all events from the backend once the component mounts and renders them in a grid
const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  // calls the backend to get the list of all events
  const fetchEvents = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axiosInstance.get("/events");
      setEvents(response.data);
    } catch (error) {
      setErrorMessage("Could not load events, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading events...</p>;
  }

  if (errorMessage) {
    return <p className="text-center text-red-600 mt-10">{errorMessage}</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center gap-3 mb-8">
          <span className="bg-indigo-100 text-indigo-600 p-3 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Upcoming Events</h1>
            <p className="text-sm text-gray-500">Explore and book your favorite events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;
