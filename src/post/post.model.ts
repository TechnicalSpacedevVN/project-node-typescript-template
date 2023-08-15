import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Post = model("Post", postSchema);
