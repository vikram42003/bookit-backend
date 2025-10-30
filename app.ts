import express from "express";

import logger from "./utils/logger.js";

const app = express();
app.use(express.json());

// Quick logging of the request endpoints
app.use(logger);

export default app;
