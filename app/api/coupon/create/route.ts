import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { addCouponSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
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

        const validateData = addCouponSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const couponData = validateData.data;

        const newCoupon = new CouponModel({
            code: couponData.code,
            discountPercentage:couponData.discountPercentage,
            minShoppingAmount: couponData.minShoppingAmount,
            validity:couponData.validity
        })
        await newCoupon.save();

        return response(
                true,
                200,
                "Coupon added Successfully",
                newCoupon
            );
    } catch (error) {
        return handleCatch(error)
    }
}