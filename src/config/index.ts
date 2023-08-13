import { config } from "dotenv";
config();

export const EMAIL = {
  USER: process.env.EMAIL_USERNAME || "",
  PASS: process.env.EMAIL_PASSWORD || "",
};

export const JWT = {
  SECRET_KEY: process.env.JWT_SECRET_KEY || "secret-key",
  EXPIRED_IN: process.env.JWT_EXPIRED_IN || 600,
};
