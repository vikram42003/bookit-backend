import express from "express";
import { Booking, IBooking } from "../models/booking";
import { TimeSlot } from "../models/timeslot";

const bookingsRouter = express.Router();

// GET /api/bookings - Get all bookings
bookingsRouter.get("/", async (req, res) => {
  try {
    const experiences: IBooking[] = await Booking.find({});
    res.json(experiences);
  } catch (e) {
    throw new Error("Server error while fetching bookings");
  }
});

// POST /api/bookings - Book the experience
bookingsRouter.post("/", async (req, res) => {
  try {
    if (
      !req.body.timeSlot ||
      !req.body.experience ||
      !req.body.userName ||
      !req.body.userEmail ||
      !req.body.finalPrice
    ) {
      return res.status(400).json({
        error: "Bad request",
        message: "Some fields are missing. Required fields - timeSlot, experience, userName, userEmail, finalPrice",
      });
    }

    if (!req.body.quantity || req.body.quantity < 1) {
      return res.status(400).json({ error: "Bad request", message: "Quantity must be at least 1" });
    }

    // We need to ensure that the server doesnt book more than capacity AND the booking operation is atomic to prevent any race conditions
    // We directly cannot read the bookedCount without querying the database for the document so we use the expression ($expr)
    // Syntax with mongodb driver triggers like $lte, $add to make the calculation on the mongodb server, and only then update the booking
    const result = await TimeSlot.updateOne(
      {
        _id: req.body.timeSlot,
        $expr: {
          $lte: [{ $add: ["$bookedCount", req.body.quantity] }, "$capacity"],
        },
      },
      { $inc: { bookedCount: req.body.quantity } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        error: "Booking failed",
        message: "Not enough capacity available for this time slot.",
      });
    }

    const newBooking: IBooking = await Booking.create(req.body);
    res.status(201).json(newBooking);
  } catch (e) {
    throw new Error("Server error while booking experience");
  }
});

export default bookingsRouter;
