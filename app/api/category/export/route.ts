import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";


export async function GET() {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const filter= {
            deletedAt: null,
        };

        const getCategory = await CategoryModel.find(filter).sort({ createdAt: -1 }).lean();
        if(!getCategory){
            return response(false, 404, "Collection empty.")
        }

        return response(true, 200, "Data found.", getCategory);
    } catch (err) {
        return handleCatch(err);
    }
}
