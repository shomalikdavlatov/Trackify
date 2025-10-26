import mongoose from "mongoose";
import { currencies } from "src/common/utils/types";


export const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        password: { type: String, required: true },
        balance: { type: Number, required: true, default: 0 },
        currency: {
            type: String,
            enum: currencies,
            required: true,
            default: 'UZS',
        },
    },
    {
        timestamps: true,
    },
);
