import _ from "lodash";
import mongoose from "mongoose";
import "./utils/mongoose-plugin";

export interface IDatabaseConfig {
  url: string;
  auth: {
    password: string;
    username: string;
  };
  dbName: string;
}

export const connectDatabase = async (options: IDatabaseConfig) => {
  mongoose.set("toJSON", {
    transform: (doc, record) => {
      record.id = record._id;
      delete record._id;
    },
  });

  await mongoose.connect(options.url, {
    auth: {
      password: options.auth.password,
      username: options.auth.username,
    },
    dbName: options.dbName,
  });
  console.log("Connected successfully to mongodb (mongoose)");
  // mongoose.sche
};
