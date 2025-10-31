import express from "express";
import cors from "cors";

import logger from "./utils/logger.js";

import experiencesRouter from "./routes/experiencesRoute.js";
import bookingsRouter from "./routes/bookingsRoute.js";
import promoCodeRouter from "./routes/promoCodeRoute.js";

const app = express();

// Middlewares
// We allow everything in cors for now since this is only a demo app for assignment and there is a time constraint
app.use(cors());
app.use(express.json());
app.use(logger);

// Health checkup endpoint
// I added this to deal with the slow cold boots on Render free tier, we can call this endpoint as soon as a user visits the app to warm up the server
app.get("/api/health", (req, res) => {
  res.json({ message: "All systems are good"})
})

// Attach routers
app.use("/api/experiences", experiencesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/promo", promoCodeRouter);

// Unknown route endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Unknown route" });
});

export default app;
