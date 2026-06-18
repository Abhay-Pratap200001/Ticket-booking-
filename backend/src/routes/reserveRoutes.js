import express from "express";
import { reserveSeats } from "../controllers/reservationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, reserveSeats);

export default router;
