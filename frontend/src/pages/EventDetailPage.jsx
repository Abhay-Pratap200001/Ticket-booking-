import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import SeatGrid from "../features/seats/SeatGrid.jsx";
import CountdownTimer from "../features/booking/CountdownTimer.jsx";

// main page for one event, handles loading seats, selecting seats, reserving and booking
const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    loadEventAndSeats();
  }, [id]);

  // fetches the event details and its seat list together
  const loadEventAndSeats = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [eventResponse, seatsResponse] = await Promise.all([
        axiosInstance.get(`/events/${id}`),
        axiosInstance.get(`/events/${id}/seats`),
      ]);
      setEvent(eventResponse.data);
      setSeats(seatsResponse.data);
    } catch (error) {
      setErrorMessage("Could not load event details, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  // adds or removes a seat number from the selected seats list
  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats((previousSelected) => {
      if (previousSelected.includes(seatNumber)) {
        return previousSelected.filter((number) => number !== seatNumber);
      }
      return [...previousSelected, seatNumber];
    });
  };

  // sends the selected seats to the backend to reserve them for 10 minutes
  const handleReserve = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (selectedSeats.length === 0) {
      setErrorMessage("Please select at least one seat");
      return;
    }

    setIsReserving(true);
    try {
      const response = await axiosInstance.post("/reserve", {
        eventId: id,
        seatNumbers: selectedSeats,
      });
      setReservation(response.data);
      await loadEventAndSeats();
    } catch (error) {
      const message = error.response?.data?.message || "Could not reserve seats";
      setErrorMessage(message);
      await loadEventAndSeats();
    } finally {
      setIsReserving(false);
    }
  };

  // confirms the booking for the active reservation
  const handleConfirmBooking = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsBooking(true);
    try {
      await axiosInstance.post("/bookings", { reservationId: reservation.reservationId });
      setSuccessMessage("Booking confirmed successfully!");
      setReservation(null);
      setSelectedSeats([]);
      await loadEventAndSeats();
    } catch (error) {
      const message = error.response?.data?.message || "Could not confirm booking";
      setErrorMessage(message);
      setReservation(null);
      await loadEventAndSeats();
    } finally {
      setIsBooking(false);
    }
  };

  // runs when the countdown timer reaches zero, clears the expired reservation
  const handleReservationExpire = () => {
    setReservation(null);
    setErrorMessage("Your reservation expired, please select seats again");
    loadEventAndSeats();
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 mt-10">Loading event...</p>;
  }

  if (!event) {
    return <p className="text-center text-red-600 mt-10">Event not found</p>;
  }

  const formattedDate = new Date(event.dateTime).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">{event.name}</h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 ml-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {event.venue}
            <span className="text-gray-300">|</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {formattedDate}
          </div>
        </div>

        {errorMessage && (
          <p className="bg-red-100 text-red-700 text-sm p-3 rounded-xl mb-4">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="bg-green-100 text-green-700 text-sm p-3 rounded-xl mb-4">{successMessage}</p>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <SeatGrid seats={seats} selectedSeats={selectedSeats} onSelectSeat={handleSelectSeat} />

          {!reservation ? (
            <>
              <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 rounded-xl p-4 mt-6">
                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4Z" />
                    <path d="M9 7v10" strokeDasharray="2 2" />
                  </svg>
                </span>
                <div className="text-sm">
                  <p className="font-semibold">
                    {selectedSeats.length === 0
                      ? "You haven't selected any seats yet."
                      : `${selectedSeats.length} seat(s) selected: ${selectedSeats.join(", ")}`}
                  </p>
                  <p className="text-indigo-500">Select your preferred seats to continue.</p>
                </div>
              </div>

              <button
                onClick={handleReserve}
                disabled={isReserving || selectedSeats.length === 0}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl mt-4 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4Z" />
                </svg>
                {isReserving ? "Reserving..." : `Reserve ${selectedSeats.length} seat(s)`}
              </button>
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 bg-green-50 rounded-xl p-4 mt-6">
              <div>
                <p className="text-sm font-semibold text-green-700">
                  Seats reserved: {reservation.seatNumbers.join(", ")}
                </p>
                <CountdownTimer expiresAt={reservation.expiresAt} onExpire={handleReservationExpire} />
              </div>
              <button
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium disabled:opacity-50"
              >
                {isBooking ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
