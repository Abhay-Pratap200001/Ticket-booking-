# Event Ticket Booking App

A simplified event ticket booking system built with the MERN stack. Users can browse
events, select seats on a live seat map, reserve them for a short window, and confirm
the booking before the reservation expires.

**Live Demo:** [https://ticket-booking-pv8a.onrender.com](https://ticket-booking-pv8a.onrender.com)

> Note: the demo runs on Render's free tier, so the server spins down after periods
> of inactivity. The first request after idling can take up to ~50 seconds to wake up.

---

## Screenshots

| Home / Events | Seat Selection |
|----------------|------------------|
| <img width="941" height="905" alt="image" src="https://github.com/user-attachments/assets/37607d3c-15dd-42f7-9df5-d29c16e67021" />

| Seat Selection  | Seat Selection |
|----------------|------------------|
|<img width="947" height="927" alt="image" src="https://github.com/user-attachments/assets/32dba3c9-0801-49cc-84c9-ec3dbace5f86" />
|


| Login | Register |
|---------|------------|
| <img width="957" height="922" alt="image" src="https://github.com/user-attachments/assets/22c4a96e-0720-4ef5-9ee5-a2a92ab0168e" />

| Register | Register |
|---------|------------|
 |<img width="963" height="876" alt="image" src="https://github.com/user-attachments/assets/ed82b607-a819-40a2-b883-3742e8b5129e" />
|

> Drop your screenshot files into the `screenshots/` folder using the filenames
> above (`home.png`, `seats.png`, `login.png`, `register.png`) and they'll render
> automatically here. Add or rename rows as needed for any other screens.

---

## Tech Stack

| Layer    | Technology                                       |
|----------|---------------------------------------------------|
| Frontend | React (Vite), Tailwind CSS, Axios, React Router    |
| Backend  | Node.js, Express, Mongoose                         |
| Database | MongoDB                                            |
| Auth     | JWT (JSON Web Tokens)                              |
| Hosting  | Render (single web service, serves both API + UI)  |

---

## Folder Structure

```
ticket-booking/
├── package.json             Root scripts: build (frontend) + start (backend) for deployment
│
├── backend/                 Express + MongoDB API
│   └── src/
│       ├── config/          Database connection setup
│       ├── models/          Mongoose schemas (Event, Seat, Reservation, User)
│       ├── controllers/     Route handler logic
│       ├── routes/          Express route definitions
│       ├── middleware/      JWT auth middleware
│       ├── utils/           Seed script for sample data
│       └── server.js        App entry point (also serves the built frontend)
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

## Running It Locally

During development, the backend and frontend run as two separate servers
(frontend on Vite's dev server, backend on Express), talking to each other over HTTP.

### Prerequisites

- Node.js v18 or later
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

### 3. Try It Out

1. Open `http://localhost:5173` and click **Register** to create an account.
2. Pick an event from the home page.
3. Select one or more available (green) seats.
4. Click **Reserve** — the seats turn yellow and a 10-minute countdown starts.
5. Click **Confirm Booking** before the timer runs out — the seats turn gray (booked).

---

## Deployment Notes

In production, there's no separate frontend server — the Express backend serves the
built React app as static files, and both the API and UI are served from the same
origin. This is why the deployed app and the API share a single Render URL.

The root `package.json` orchestrates this:

```json
"build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
"start": "node backend/src/server.js"
```

On Render: **Build Command** is `npm run build`, **Start Command** is `npm start`,
and `MONGO_URI`, `JWT_SECRET`, and `RESERVATION_MINUTES` are set as environment
variables in the Render dashboard (not committed to the repo).

---

## API Reference

| Method | Endpoint                | Auth required | Description                                          |
|--------|---------------------------|----------------|--------------------------------------------------------|
| GET    | `/api/events`               | No             | List all events                                         |
| GET    | `/api/events/:id`            | No             | Get details for a single event                          |
| GET    | `/api/events/:id/seats`       | No             | Get all seats for an event (used by the seat grid)        |
| POST   | `/api/auth/register`         | No             | Create a new user account, returns a JWT                  |
| POST   | `/api/auth/login`            | No             | Log in, returns a JWT                                    |
| POST   | `/api/reserve`                | Yes            | Reserve seats for 10 minutes                              |
| POST   | `/api/bookings`                 | Yes            | Confirm booking for an active reservation                   |

Authenticated requests must include `Authorization: Bearer <token>` in the headers.

---

## Data Models

All four collections live in MongoDB and are defined with Mongoose schemas.
Every model also gets `createdAt` and `updatedAt` automatically via `{ timestamps: true }`.

### Event

| Field        | Type     | Required | Notes                                  |
|--------------|----------|----------|-------------------------------------------|
| `name`         | String     | Yes        | Trimmed                                      |
| `dateTime`     | Date       | Yes        | When the event takes place                   |
| `venue`        | String     | Yes        | Trimmed                                      |
| `totalSeats`   | Number     | Yes        | Minimum value of `1`                          |

### Seat

| Field        | Type     | Required | Notes                                                            |
|--------------|----------|----------|----------------------------------------------------------------------|
| `eventId`      | ObjectId   | Yes        | References `Event`                                                     |
| `seatNumber`   | String     | Yes        | e.g. `"S1"`                                                            |
| `status`       | String     | No         | One of `available`, `reserved`, `booked`. Defaults to `available`        |

A unique compound index on `{ eventId, seatNumber }` prevents two seats with the
same number existing for the same event.

### Reservation

| Field          | Type       | Required | Notes                                          |
|----------------|------------|----------|------------------------------------------------------|
| `userId`         | ObjectId     | Yes        | References `User`                                       |
| `eventId`        | ObjectId     | Yes        | References `Event`                                      |
| `seatNumbers`     | [String]     | Yes        | The seats held by this reservation                       |
| `expiresAt`       | Date         | Yes        | When the hold on these seats expires                      |

A TTL index on `expiresAt` (`expireAfterSeconds: 0`) auto-deletes the document
once it expires.

### User

| Field        | Type     | Required | Notes                                  |
|--------------|----------|----------|-------------------------------------------|
| `name`         | String     | Yes        | Trimmed                                      |
| `email`        | String     | Yes        | Unique, lowercased, trimmed                   |
| `password`     | String     | Yes        | Stored as a bcrypt hash, never the plain text  |

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
  document once it expires.
- `POST /api/bookings` independently checks `expiresAt` against the current time
  before marking seats as `booked`. This means an expired reservation can never be
  confirmed, even in the brief window before MongoDB's TTL cleanup runs.

### What happens after a successful booking

Seats are set to `booked` and the reservation document is deleted in the same
request — there's no need to keep the reservation around once it's fulfilled.
