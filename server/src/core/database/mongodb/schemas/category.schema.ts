import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
    name: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true}
});

CategorySchema.index({ name: 1, userId: 1 }, { unique: true });