import { Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    content: {
      type: String,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    refId: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

export const Comment = model("Comment", CommentSchema);
