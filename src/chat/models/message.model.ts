import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    conversation: {
      type: Schema.ObjectId,
      ref: "Conversation",
    },
    sender: {
      type: Schema.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Message = model("Message", MessageSchema);
