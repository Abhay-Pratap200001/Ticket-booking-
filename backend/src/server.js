import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import path from 'path';


import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import reserveRoutes from "./routes/reserveRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/reserve", reserveRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(express.static(path.join(__dirname, 'frontend/dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
})

// connect to the database first and only start listening once it succeeds
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
