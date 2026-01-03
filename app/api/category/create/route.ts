import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { addCategorySchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

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

        const validateData = addCategorySchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const { name, slug } = validateData.data;

        const newCategory = new CategoryModel({
            name, slug
        })
        await newCategory.save();

        return response(
                true,
                200,
                "Category added Successfully",
                newCategory
            );
    } catch (error) {
        return handleCatch(error)
    }
}