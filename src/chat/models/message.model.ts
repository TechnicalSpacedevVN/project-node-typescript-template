import { Schema, model } from "mongoose";

const MessagesSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
});

export const Message = model("Message", MessagesSchema);
