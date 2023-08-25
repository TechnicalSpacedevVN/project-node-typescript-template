import mongoose, { Schema } from "mongoose";

const LocationSchema = new Schema({
  type: { type: String, default: "Point" },
  coordinates: {
    type: [Number],
  },
});

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: "text",
    },
    nickname: String,
    hideFriendList: {
      type: Boolean,
      default: false,
    },
    location: LocationSchema,
    cover: String,

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
UserSchema.index({ "location.coordinates": "2dsphere" });
// export const userSchema = `
//     type User {
//         id: String
//         name: String
//     }
// `;

export const User = mongoose.model("User", UserSchema);
