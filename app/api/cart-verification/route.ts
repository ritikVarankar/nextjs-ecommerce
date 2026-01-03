import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

interface CartPayloadItem {
  variantId: string;
  qty: number;
}

export async function POST(request: NextRequest) {
  try {
    const payload: CartPayloadItem[] = await request.json();
    await connectDB();

    const verifiedCartData = (
      await Promise.all(
        payload.map(async (cartItem) => {
          if (!mongoose.Types.ObjectId.isValid(cartItem.variantId)) return null;

          const variant = await ProductVariantModel.findById(cartItem.variantId)
            .populate("product")
            .populate("media", "secure_url")
            .lean() as any;

          if (!variant || !variant.product) return null;

          return {
            productId: variant.product._id,
            variantId: variant._id,
            name: variant.product.name,
            url: variant.product.slug,
            size: variant.size,
            color: variant.color,
            mrp: variant.mrp,
            sellingPrice: variant.sellingPrice,
            media: variant.media?.[0]?.secure_url ?? "",
            qty: cartItem.qty,
          };
        })
      )
    ).filter(Boolean); // 🔥 removes null values

    return response(true, 200, "Verified Cart Data", verifiedCartData);
  } catch (error) {
    return handleCatch(error);
  }
}
