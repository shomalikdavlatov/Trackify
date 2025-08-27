import mongoose from 'mongoose';

const { Schema } = mongoose;

export const CategorySchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
);

CategorySchema.index({ user: 1, type: 1, name: 1 }, { unique: true });
