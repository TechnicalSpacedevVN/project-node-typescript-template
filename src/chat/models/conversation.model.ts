import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isGroup: Boolean,
});

export const Conversation = model("Conversation", ConversationSchema);
