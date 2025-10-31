import express from "express";
import { Experience, IExperience } from "../models/experience";
import { ITimeSlot, TimeSlot } from "../models/timeslot";

const experiencesRouter = express.Router();

// GET /api/experiences - Get all experiences
experiencesRouter.get("/", async (req, res) => {
  try {
    const experiences: IExperience[] = await Experience.find({});
    res.json(experiences);
  } catch (e) {
    throw new Error("Server error while fetching experiences");
  }
});

// GET /api/experiences/:id - Get specific experience along with available booking slots
experiencesRouter.get("/:id", async (req, res) => {
  try {
    const experience: IExperience | null = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const timeSlots: ITimeSlot[] = await TimeSlot.find({ experience: experience.id }).sort({ dateTime: 1 });
    res.json({ experience, timeSlots });
  } catch (e) {
    throw new Error(`Server error while fetching experience with id ${req.params.id}`);
  }
});

// POST /api/experiences - Add experience
experiencesRouter.post("/", async (req, res) => {
  try {
    const newExperience: IExperience = await Experience.create(req.body);
    res.status(201).json(newExperience);
  } catch (e: any) {
    // If its a validation error handle here, else thorw it so it can be handled by main error handler middleware
    if (e.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid data provided for experience",
        errors: e.errors,
      });
    }
    throw new Error("Server error while creating experience");
  }
});

export default experiencesRouter;
