import { Schema, model } from "mongoose";

const HidePostSchema = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "hide_post",
  }
);

export const HidePost = model("Hide Post", HidePostSchema);
