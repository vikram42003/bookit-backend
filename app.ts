import express from "express";
import cors from "cors";

import logger from "./utils/logger.js";

import experiencesRouter from "./routes/experiencesRoute.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// Attach routers
app.use("/api/experiences", experiencesRouter);

// Unknown route endpoint
app.use((req, res) => {
  res.status(404).json({ message: "Unknown route" });
});

export default app;
