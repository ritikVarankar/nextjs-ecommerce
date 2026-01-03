import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";

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

        const getProductVariant = await ProductVariantModel.findOne(filter).populate('media','_id secure_url').lean();

        if (!getProductVariant) {
            return response(false, 404, "Product Variant not found.");
        }

        return response(true, 200, "Product Variant found.", getProductVariant);
    } catch (err) {
        return handleCatch(err);
    }
}
