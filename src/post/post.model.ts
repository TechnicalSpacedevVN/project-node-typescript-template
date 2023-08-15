import { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    content: {
      type: String,
      index: "text",
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    media: {
      type: String,
    },
    type: {
      type: String,
      enum: ["text", "video", "image"],
      default: "text",
    },
    userHiddens: [Schema.Types.ObjectId],
    shareFrom: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    policy: {
      type: String,
      enum: ["private", "public", "friend"],
      default: "public",
    },
    hashtags: [String],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Post = model("Post", postSchema);
