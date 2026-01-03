import mongoose from "mongoose"
import MediaModel from "./media.model";
import CategoryModel from "./Category.model";

export interface ProductType extends Document {
  name: string;
  slug: string;
  category: mongoose.Types.ObjectId;  // Use ObjectId explicitly here
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  media: mongoose.Types.ObjectId[];  // Array of ObjectId for media
  description: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<ProductType>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:CategoryModel.modelName,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:MediaModel.modelName,
      required: true
    }
  ],
  description: {
    type: String,
    required: true,
    trim: true,
  },
  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, { timestamps: true })

productSchema.index({ category:1 });
const ProductModel = mongoose.models.Product || mongoose.model('Product',productSchema,'products');

export default ProductModel;