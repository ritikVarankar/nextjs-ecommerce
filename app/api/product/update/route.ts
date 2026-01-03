import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { updateProductSchema } from "@/lib/zodSchema";
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

        const validateData = updateProductSchema.safeParse(payload);
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
            name,
            slug,
            category,
            mrp,
            sellingPrice,
            discountPercentage,
            description,
            media
         } = validateData.data;
        const getProduct = await ProductModel.findOne({ deletedAt:null, _id })
        if (!getProduct) {
            return response(false, 404, "Product not found");
        }
        getProduct.name=name;
        getProduct.slug=slug;
        getProduct.category=category;
        getProduct.mrp=mrp;
        getProduct.sellingPrice=sellingPrice;
        getProduct.discountPercentage=discountPercentage;
        getProduct.description=encode(description);
        getProduct.media=media;

        await getProduct.save();
        

        return response(
                true,
                200,
                "Product updated Successfully"
            );
    } catch (error) {
        return handleCatch(error)
    }
}