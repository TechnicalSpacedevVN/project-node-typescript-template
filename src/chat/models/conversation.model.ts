import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isGroup: Boolean,
  groupCover: String,
  name: String,
});

export const Conversation = model("Conversation", ConversationSchema);
