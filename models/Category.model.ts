import mongoose, { Schema, Document, Model } from "mongoose";

export interface CategoryType extends Document {
  name: string;
  slug: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryType>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, { timestamps: true });

const CategoryModel: Model<CategoryType> =
  mongoose.models.Category ||
  mongoose.model<CategoryType>("Category", categorySchema, "categories");

export default CategoryModel;
