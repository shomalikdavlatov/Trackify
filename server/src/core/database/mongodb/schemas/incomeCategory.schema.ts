import mongoose from "mongoose";

export const IncomeCategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true}
});

IncomeCategorySchema.index({ name: 1, userId: 1 }, { unique: true });