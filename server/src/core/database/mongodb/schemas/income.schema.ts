import mongoose from 'mongoose';

export const IncomeSchema = new mongoose.Schema({
    description: { type: String },
    amount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, required: true },
});
