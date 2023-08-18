import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: "text",
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
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
    changePasswordHistories: [
      {
        password: String,
        changeAt: Date,
      },
    ],
    sendMailAt: Date,
  },
  {
    timestamps: true,
  }
);

// export const userSchema = `
//     type User {
//         id: String
//         name: String
//     }
// `;

export const User = mongoose.model("User", UserSchema);
