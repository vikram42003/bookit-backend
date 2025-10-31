import express from "express";
import { Booking } from "../models/booking";
import { Experience } from "../models/experience";
import { TimeSlot } from "../models/timeslot";
import { PromoCode } from "../models/promoCode";
import { BookingType, ExperienceType, PromoCodeType } from "../types/types";

const bookingsRouter = express.Router();

// GET /api/bookings - Get all bookings
bookingsRouter.get("/", async (req, res) => {
  try {
    const experiences = (await Booking.find({})) as BookingType[];
    res.json(experiences);
  } catch (e) {
    throw new Error("Server error while fetching bookings");
  }
});

// POST /api/bookings - Book the experience
bookingsRouter.post("/", async (req, res) => {
  try {
    if (!req.body.timeSlot || !req.body.experience || !req.body.userName || !req.body.userEmail) {
      return res.status(400).json({
        error: "Bad request",
        message: "Some fields are missing. Required fields - timeSlot, experience, userName, userEmail",
      });
    }

    if (!req.body.quantity || req.body.quantity < 1) {
      return res.status(400).json({ error: "Bad request", message: "Quantity must be at least 1" });
    }

    // Get the experience to see the final price from the server
    const experience = (await Experience.findById(req.body.experience)) as ExperienceType;
    if (!experience) {
      return res.status(404).json({ error: "Not found", message: "Experience not found" });
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

    let finalPrice = experience.price * req.body.quantity;

    // Check and apply the promo code
    if (req.body.promoCode) {
      const promoCode = (await PromoCode.findOne({ code: req.body.promoCode })) as PromoCodeType;
      if (promoCode) {
        if (promoCode.type === "percentage") {
          finalPrice = finalPrice * (1 - promoCode.value / 100);
        } else if (promoCode.type === "flat") {
          finalPrice = Math.max(0, finalPrice - promoCode.value);
        }
      }
    }

    const newBooking = await Booking.create({
      ...req.body,
      finalPrice,
    });

    res.status(201).json(newBooking);
  } catch (e) {
    throw new Error("Server error while booking experience");
  }
});

export default bookingsRouter;
