import dotenv from "dotenv";
dotenv.config();

const PORT: string | undefined = process.env.PORT ?? "3003";
const MONGODB_URL: string | undefined = process.env.MONGODB_URL;

const env = {
  MONGODB_URL,
  PORT,
};

export default env;
