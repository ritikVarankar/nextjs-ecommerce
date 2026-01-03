import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";

interface RouteParams {
    id: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const { id } = await params;

        if (!isValidObjectId(id)) {
            return response(false, 400, "Invalid object id");
        }

        const filter: { deletedAt: null; _id?: string } = {
            deletedAt: null,
        };

        filter._id = id;

        const getCategory = await CategoryModel.findOne(filter).lean();

        if (!getCategory) {
            return response(false, 404, "Category not found.");
        }

        return response(true, 200, "Category found.", getCategory);
    } catch (err) {
        return handleCatch(err);
    }
}
