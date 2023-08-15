import _ from "lodash";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      index: "text",
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    code: {
      type: String,
      default: null,
      required: false,
    },
    loginHistories: [
      {
        time: Date,
        ip: String,
      },
    ],
    enabled: Boolean,
    passwordOneTime: {
      type: [String],
      select: false,
    },
    towLayerSecurity: Boolean,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
