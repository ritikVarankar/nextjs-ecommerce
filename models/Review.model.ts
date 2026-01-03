import mongoose from "mongoose"
import ProductModel from "./Product.model";
import UserModel from "./User.model";

export interface ReviewType extends Document {
    product:mongoose.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    rating: number;
    title:string;
    review :string; 
    deletedAt: Date | null;
}

const reviewSchema = new mongoose.Schema<ReviewType>({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref:ProductModel.modelName,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:UserModel.modelName,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    },
}, { timestamps: true })

const ReviewModel = mongoose.models.Review || mongoose.model('Review',reviewSchema,'reviews');

export default ReviewModel;