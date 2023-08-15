import { Schema, model } from "mongoose";

const friendSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    confirm: Boolean,
    times: Number,
  },
  {
    timestamps: true,
  }
);

export const Friend = model("Friend", friendSchema);
