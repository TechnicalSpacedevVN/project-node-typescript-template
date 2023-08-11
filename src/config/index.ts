import { config } from "dotenv";
config();

export const EMAIL = {
  USER: process.env.EMAIL_USERNAME,
  PASS: process.env.EMAIL_PASSWORD,
};
