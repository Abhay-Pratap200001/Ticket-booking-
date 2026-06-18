import { Link } from "react-router-dom";
import { getEventTheme } from "./eventTheme.js";

// small set of inline icons so the card does not need an external icon library
const ICONS = {
  mic: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v4" />
    </svg>
  ),
  music: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  calendar: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
};

// shows a single event summary in the events list, links to event detail page
const EventCard = ({ event }) => {
  const theme = getEventTheme(event.name, event._id);

  const formattedDate = new Date(event.dateTime).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Link
      to={`/events/${event._id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden border border-gray-100"
    >
      <div className="relative h-36">
        <img src={theme.image} alt={event.name} className="w-full h-full object-cover" />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3 -mt-9 mb-2">
          <span className={`${theme.colorClass} text-white p-2.5 rounded-xl shadow-md`}>
            {ICONS[theme.icon]}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-800">{event.name}</h3>

        <p className="flex items-center gap-2 text-sm text-gray-500 mt-2">
          {ICONS.calendar}
          {formattedDate}
        </p>
        <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {event.venue}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {event.totalSeats} total seats
          </span>
          <span className="bg-indigo-50 text-indigo-600 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
