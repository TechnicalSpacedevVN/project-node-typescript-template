import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    usersHidden: [
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

export const Comment = model("Comment", commentSchema);
