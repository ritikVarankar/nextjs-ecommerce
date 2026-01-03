import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { updateProductSchema, updateProductVariantSchema } from "@/lib/zodSchema";
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

        const validateData = updateProductVariantSchema.safeParse(payload);
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
            product,
            sku,
            color,
            mrp,
            sellingPrice,
            discountPercentage,
            size,
            media
         } = validateData.data;
        const getProductVariant = await ProductModel.findOne({ deletedAt:null, _id })
        if (!getProductVariant) {
            return response(false, 404, "Product Variant not found");
        }
        getProductVariant.product=product;
        getProductVariant.sku=sku;
        getProductVariant.color=color;
        getProductVariant.mrp=mrp;
        getProductVariant.sellingPrice=sellingPrice;
        getProductVariant.discountPercentage=discountPercentage;
        getProductVariant.size=size;
        getProductVariant.media=media;

        await getProductVariant.save();
        

        return response(
                true,
                200,
                "Product Variant updated Successfully"
            );
    } catch (error) {
        return handleCatch(error)
    }
}