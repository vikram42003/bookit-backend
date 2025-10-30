require("dotenv").config();

const PORT: string | undefined = process.env.PORT;
const MONGODB_URL: string | undefined = process.env.MONGODB_URL;

const config = {
  MONGODB_URL,
  PORT,
};

module.exports = config;
