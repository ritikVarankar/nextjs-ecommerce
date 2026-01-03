import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { addCategorySchema, updateCategorySchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

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

        const validateData = updateCategorySchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const {  _id,name, slug } = validateData.data;
        const getCategory = await CategoryModel.findOne({ deletedAt:null, _id })
        if (!getCategory) {
            return response(false, 404, "Category not found");
        }
        getCategory.name=name;
        getCategory.slug = slug;
        await getCategory.save();
        

        return response(
                true,
                200,
                "Category updated Successfully"
            );
    } catch (error) {
        return handleCatch(error)
    }
}