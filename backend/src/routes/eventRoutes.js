import express from "express";
import { getAllEvents, getEventById } from "../controllers/eventController.js";
import { getSeatsByEvent } from "../controllers/seatController.js";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/:id/seats", getSeatsByEvent);

export default router;
