# Event Ticket Booking App

A simplified event ticket booking system built with the MERN stack. Users can browse
events, select seats on a live seat map, reserve them for a short window, and confirm
the booking before the reservation expires.

---

## Tech Stack

| Layer    | Technology                                  |
|----------|----------------------------------------------|
| Frontend | React (Vite), Tailwind CSS, Axios, React Router |
| Backend  | Node.js, Express, Mongoose                   |
| Database | MongoDB                                       |
| Auth     | JWT (JSON Web Tokens)                         |

## Folder Structure

```
ticket-booking/
├── backend/                 Express + MongoDB API
│   └── src/
│       ├── config/          Database connection setup
│       ├── models/          Mongoose schemas (Event, Seat, Reservation, User)
│       ├── controllers/     Route handler logic
│       ├── routes/          Express route definitions
│       ├── middleware/      JWT auth middleware
│       ├── utils/           Seed script for sample data
│       └── server.js        App entry point
│
└── frontend/                React client
    └── src/
        ├── api/              Shared axios instance
        ├── context/          Auth context (stores logged-in user + token)
        ├── components/       Shared UI (Navbar, ProtectedRoute, AuthLayout)
        ├── features/
        │   ├── auth/         Login / register forms
        │   ├── events/       Event list and event card
        │   ├── seats/        Seat grid and seat button
        │   └── booking/      Countdown timer
        └── pages/            Top-level routed pages
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ticket-booking
JWT_SECRET=your-secret-key-here
RESERVATION_MINUTES=10
```

Seed the database with a few sample events and seats:

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

### 3. Try it out

1. Open `http://localhost:5173` and click **Register** to create an account.
2. Pick an event from the home page.
3. Select one or more available (green) seats.
4. Click **Reserve** — the seats turn yellow and a 10-minute countdown starts.
5. Click **Confirm Booking** before the timer runs out — the seats turn gray (booked).

---

## API Reference

| Method | Endpoint                | Auth required | Description                                   |
|--------|--------------------------|----------------|------------------------------------------------|
| GET    | `/api/events`              | No             | List all events                                 |
| GET    | `/api/events/:id`           | No             | Get details for a single event                  |
| GET    | `/api/events/:id/seats`      | No             | Get all seats for an event (used by the seat grid) |
| POST   | `/api/auth/register`        | No             | Create a new user account, returns a JWT         |
| POST   | `/api/auth/login`           | No             | Log in, returns a JWT                            |
| POST   | `/api/reserve`               | Yes            | Reserve seats for 10 minutes                     |
| POST   | `/api/bookings`               | Yes            | Confirm booking for an active reservation          |

Authenticated requests must include `Authorization: Bearer <token>` in the headers.

---

## Assumptions

Since some parts of the assignment were left open-ended, these decisions were made:

- **Authentication**: The data model didn't describe a `User` schema, but "Basic User
  Authentication" was listed as a technical expectation. A minimal email/password
  flow with JWTs was added — register and login only, no password reset or roles.
- **Seat listing endpoint**: The assignment didn't list an endpoint for fetching a
  single event's seats, but the UI flow requires showing a seat grid. `GET
  /api/events/:id/seats` was added to support that.
- **Seeding events**: There's no endpoint to create events, so sample events and
  seats are loaded via `npm run seed` instead.
- **Reservation length**: Defaults to 10 minutes as specified, configurable through
  `RESERVATION_MINUTES` in `.env`.

---

## Design Decisions

### How double booking is prevented

Each seat has a `status` field: `available`, `reserved`, or `booked`.

When a user tries to reserve seats, the backend updates each seat **one at a time**
using:

```js
Seat.findOneAndUpdate(
  { eventId, seatNumber, status: "available" },
  { status: "reserved" }
)
```

This update is atomic at the document level in MongoDB — if two users try to reserve
the same seat at the same moment, only one request can match `status: "available"`.
The other request gets `null` back for that seat and the whole reservation fails.

If any seat in the request can't be reserved, the seats that *were* successfully
reserved by that same request are immediately rolled back to `available`. This
guarantees a partial failure never leaves seats stuck in a half-reserved state.

### How expired reservations are handled

- Every `Reservation` document stores an `expiresAt` timestamp.
- A MongoDB **TTL index** on `expiresAt` automatically deletes the reservation
  document once it expires, freeing up the seats for other users (well, the seats
  themselves stay `reserved` until cleaned up — see note below).
- `POST /api/bookings` independently checks `expiresAt` against the current time
  before marking seats as `booked`. This means an expired reservation can never be
  confirmed, even in the brief window before MongoDB's TTL cleanup runs.

### What happens after a successful booking

Seats are set to `booked` and the reservation document is deleted in the same
request — there's no need to keep the reservation around once it's fulfilled.
