import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { addProductVariantSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

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

        const validateData = addProductVariantSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const productVariantData = validateData.data;

        const newProductVariant = new ProductVariantModel({
            sku:productVariantData.sku,
            color:productVariantData.color,
            size:productVariantData.size,
            product: productVariantData.product,
            mrp:productVariantData.mrp,
            sellingPrice:productVariantData.sellingPrice,
            discountPercentage:productVariantData.discountPercentage,
            media:productVariantData.media
        })
        await newProductVariant.save();

        return response(
                true,
                200,
                "Product Variant added Successfully",
                newProductVariant
            );
    } catch (error) {
        return handleCatch(error)
    }
}