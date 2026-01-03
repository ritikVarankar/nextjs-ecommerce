import mongoose from "mongoose"

export interface CouponType extends Document {
  code: string;
  discountPercentage: number;
  validity: Date;  
  minShoppingAmount: number;
  deletedAt: Date | null;
}

const couponSchema = new mongoose.Schema<CouponType>({
  code: {
    type: String,
    required: true,
    unique:true,
    trim:true
  },
  discountPercentage: {
    type: Number,
    required: true,
    trim:true
  },
  minShoppingAmount: {
    type: Number,
    required: true,
    trim:true
  },
  validity: {
    type: Date,
    required: true
  },
  deletedAt: {
    type: Date,
    default: null,
    index: true,
  },
}, { timestamps: true })

const CouponModel = mongoose.models.Coupon || mongoose.model('Coupon',couponSchema,'coupons');

export default CouponModel;