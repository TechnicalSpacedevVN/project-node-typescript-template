import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Conversation = model("Conversation", ConversationSchema);
