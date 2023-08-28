import { Schema, model } from "mongoose";

const HideContentSchema = new Schema(
  {
    refId: {
      type: Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["Post", "Comment"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "hide_content",
  }
);

export const HideContent = model("Hide Content", HideContentSchema);
