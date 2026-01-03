import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { updateCouponSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";


import { NextRequest } from "next/server";

export async function PUT(request:NextRequest) {
    const payload = await request.json();
    try {
        const auth = await isAuthenticated('admin');
        if(!auth.isAuth){
            return response(
                false,
                403,
                "Unauthorized."
            ); 
        }
        await connectDB();

        const validateData = updateCouponSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const {  
            _id,
            code,
            discountPercentage,
            minShoppingAmount,
            validity
         } = validateData.data;
        const getCoupon = await CouponModel.findOne({ deletedAt:null, _id })
        if (!getCoupon) {
            return response(false, 404, "Coupon not found");
        }
        getCoupon.code=code;
        getCoupon.minShoppingAmount=minShoppingAmount;
        getCoupon.validity=validity;
        getCoupon.discountPercentage=discountPercentage;

        await getCoupon.save();
        

        return response(
                true,
                200,
                "Coupon updated Successfully"
            );
    } catch (error) {
        return handleCatch(error)
    }
}