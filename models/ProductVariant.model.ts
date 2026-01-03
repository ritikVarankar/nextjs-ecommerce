import mongoose from "mongoose"
import ProductModel from "./Product.model";
import MediaModel from "./media.model";

export interface ProductVariantType extends Document {
  product:mongoose.Types.ObjectId;
  color: string;
  size: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  sku: string;
  media: mongoose.Types.ObjectId[];  // Array of ObjectId for media
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new mongoose.Schema<ProductVariantType>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref:ProductModel.modelName,
    required: true
  },
  color: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
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
  sku: {
    type: String,
    required: true,
    unique: true
  },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:MediaModel.modelName,
      required: true
    }
  ],
  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, { timestamps: true })

const ProductVariantModel = mongoose.models.ProductVariant || mongoose.model('ProductVariant',productVariantSchema,'productvariants');

export default ProductVariantModel;