import mongoose from "mongoose";

export const TrackSchema = new mongoose.Schema({
    type: {type: Boolean, required: true}, // true for income and false for expense
    description: {type: String},
    amount: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, required: true}
})