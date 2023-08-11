import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: null,
      required: false
    },
  },
  {
    timestamps: true,
  }
);

export const userSchema = `
    type User {
        id: String
        name: String
    }
`;

export const User = mongoose.model("User", UserSchema);
