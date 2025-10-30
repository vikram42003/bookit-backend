import app from "./app";
import config from "./utils/env";
import { connectDB } from "./config/mongodb";

// If the DB connection is successful only then start the express backend
connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
});
