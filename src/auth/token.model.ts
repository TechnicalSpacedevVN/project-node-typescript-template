import mongoose, { Schema } from "mongoose";

const TokenSchema = new Schema({
    refreshToken: {
        type: String,
        required: true
    },
    enabled: {
        type: Schema.Types.Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

export const Token = mongoose.model('Token', TokenSchema)