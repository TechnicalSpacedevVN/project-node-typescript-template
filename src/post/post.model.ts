import { Schema, model } from "mongoose";

const postSchema = new Schema({
  content: {
    type: String,
    index: "text",
  },
});

export const Post = model("Post", postSchema);
