import app from "./app.js";
import config from "./utils/env.js";
import { connectDB, closeDB } from "./config/mongodb.js";

// If the DB connection is successful only then start the express backend
connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
});


// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await closeDB();
  process.exit(0);
});
