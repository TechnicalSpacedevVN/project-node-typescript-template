import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: String,
});

export const userSchema = `
    type User {
        name: String
    }
`;

export const User = mongoose.model("User", UserSchema);
