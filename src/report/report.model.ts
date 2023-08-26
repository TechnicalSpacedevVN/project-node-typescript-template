import { Schema, model } from "mongoose";

const ReportSchema = new Schema(
  {
    content: {
      type: String,
    },
    refId: {
      type: Schema.Types.ObjectId,
    },
    type: {
      type: String,
      enum: ["Post", "User"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Report = model("Report", ReportSchema);
