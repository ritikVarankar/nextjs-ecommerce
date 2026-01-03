import mongoose from "mongoose"
import { unique } from "next/dist/build/utils"
import { required, trim } from "zod/v4-mini"
import bcrypt from "bcryptjs"
import UserModel from "./User.model";
import ProductModel from "./Product.model";
import ProductVariantModel from "./ProductVariant.model";
import { ProductDataType } from "@/store/reducer/cartReducer";
import { orderStatus } from "@/lib/helperFunction";


export interface OrderType extends Document {
    user:mongoose.Schema.Types.ObjectId;
    name: string;
    email:string;
    phone: string;
    country:string;
    state: string;
    city:string;
    pincode: string;
    landmark:string;
    ordernote:string;
    products:ProductDataType;
    subtotal:number;
    discount:number;
    couponDiscount:number;
    totalAmount:number;
    orderstatus:string;
    payment_id:string;
    order_id:string;
    deletedAt: Date | null;
}


const orderSchema = new mongoose.Schema<OrderType>({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:UserModel.modelName,
        required: false
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    phone: {
        type:String,
        required:true,
        trim:true
    },
    country:{
        type:String,
        required:true,
        trim:true
    },
    state: {
        type:String,
        required:true,
        trim:true
    },
    city:{
        type:String,
        required:true,
        trim:true
    },
    pincode: {
        type:String,
        required:true,
        trim:true
    },
    landmark:{
        type:String,
        required:true,
        trim:true
    },
    ordernote:{
        type:String,
        required:false,
        trim:true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:ProductModel.modelName,
                required: true
            },
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref:ProductVariantModel.modelName,
                required: true
            },
            qty: {
                type:String,
                required:true
            },
            mrp: {
                type:String,
                required:true
            },
            sellingPrice: {
                type:String,
                required:true
            },
            name: {
                type:String,
                required:true
            }
        }
    ],
    subtotal: {
        type:Number,
        required:true
    },
    discount: {
        type:Number,
        required:true
    },
    couponDiscount: {
        type:Number,
        required:true
    },
    totalAmount: {
        type:Number,
        required:true
    },
    orderstatus: {
        type:String,
        enum:orderStatus,
        default:'pending'
    },
    payment_id: {
        type:String,
        required:true
    },
    order_id: {
        type:String,
        required:true
    },
    deletedAt:{
        type:Date,
        default:null,
        index:true
    }
}, { timestamps:true })


const OrderModel = mongoose.models.Order || mongoose.model('Order',orderSchema,'orders');

export default OrderModel;