import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { addProductSchema, zodSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";

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

        const validateData = addProductSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const productData = validateData.data;

        const newProduct = new ProductModel({
            name:productData.name,
            slug:productData.slug,
            category:productData.category,
            mrp:productData.mrp,
            sellingPrice:productData.sellingPrice,
            discountPercentage:productData.discountPercentage,
            description:encode(productData.description),
            media:productData.media
        })
        await newProduct.save();

        return response(
                true,
                200,
                "Product added Successfully",
                newProduct
            );
    } catch (error) {
        return handleCatch(error)
    }
}