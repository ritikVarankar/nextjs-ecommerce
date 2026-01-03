import { isAuthenticated } from "@/lib/authentication";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { addCategorySchema, addReviewSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";
import ReviewModel from "@/models/Review.model";

import { NextRequest } from "next/server";

export async function POST(request:NextRequest) {
    const payload = await request.json();
    try {
        const auth = await isAuthenticated('user');
        if(!auth.isAuth){
            return response(
                false,
                403,
                "Unauthorized."
            ); 
        }
        await connectDB();

        const validateData = addReviewSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const { 
            product,
            userId,
            rating,
            title,
            review 
        } = validateData.data;

        const newReview = new ReviewModel({
            product,
            user:userId,
            rating,
            title,
            review 
        })
        await newReview.save();

        return response(
                true,
                200,
                "Your review submitted successfully",
                newReview
            );
    } catch (error) {
        return handleCatch(error)
    }
}