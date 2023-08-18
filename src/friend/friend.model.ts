import { Schema, model } from "mongoose";

const friendSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // as: 'sender'
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // as: 'receiver'
    },
    confirm: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Friend = model("Friend", friendSchema);
