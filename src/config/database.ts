import { IDatabaseConfig } from "../core/mongoose-config";
import { config } from "dotenv";
config();

export const databaseConfig: IDatabaseConfig = {
  url: process.env.DB_HOST || "mongodb://localhost:27017",
  auth: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "example",
  },
  dbName: process.env.DB_NAME || "spacedev-mern-social-platform",
};
