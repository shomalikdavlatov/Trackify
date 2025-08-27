import mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema(
    {
        note: { type: String },
        amount: { type: Number, required: true },
        type: {type: String, enum: ["income", "expense"], required: true},
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, required: true },
        datetime: { type: Date, required: true, default: Date.now }
    },
    {
        timestamps: true,
    },
);
