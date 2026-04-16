import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
};
