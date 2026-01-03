
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { applyCouponSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";
import { NextRequest } from "next/server";


interface CouponDocument {
  _id: string;
  code: string;
  validity: Date;
  minShoppingAmount: number;
  discountPercentage: number;
}

export async function POST(request: NextRequest) {
  try {
    // 🔐 Auth check
    const auth = await isAuthenticated("user");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    // 📥 Parse body
    const payload = await request.json();

    // ✅ Validate payload
    const validateData = applyCouponSchema.safeParse(payload);
    if (!validateData.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields.",
        validateData.error.flatten()
      );
    }

    const { code, minShoppingAmount } = validateData.data;

    // 🔍 Fetch coupon (TYPE SAFE)
    const couponData = await CouponModel
      .findOne({ code })
      .lean<CouponDocument | null>();

    if (!couponData) {
      return response(false, 400, "Invalid or expired coupon code.");
    }

    // ⏳ Expiry check
    if (new Date() > new Date(couponData.validity)) {
      return response(false, 400, "Coupon code has expired.");
    }

    // 💰 Minimum cart amount check
    if (Number(minShoppingAmount) < couponData.minShoppingAmount) {
      return response(
        false,
        400,
        `Minimum purchase of ₹${couponData.minShoppingAmount} required.`
      );
    }

    // ✅ Success response
    return response(true, 200, "Coupon applied successfully.", {
      discountPercentage: couponData.discountPercentage,
    });

  } catch (error) {
    return handleCatch(error);
  }
}
