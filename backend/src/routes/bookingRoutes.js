import express from "express";
import { confirmBooking } from "../controllers/bookingController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, confirmBooking);

export default router;
