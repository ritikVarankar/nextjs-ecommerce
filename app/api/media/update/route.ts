import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { editMediaSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";

interface RouteParams {
    id: string;
}

export async function PUT(
    request: NextRequest
) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();
        const payload = await request.json();
        const validateData = editMediaSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }
        const { _id, alt, title } = validateData.data;

        if (!isValidObjectId(_id)) {
            return response(false, 400, "Invalid object id");
        }
        console.log("Execute")
        const getMedia = await MediaModel.findById(_id);
        if (!getMedia) {
            return response(false, 404, "Media not found");
        }
        if(!getMedia.public_id){
            getMedia.public_id=_id;
        }
        getMedia.alt=alt;
        getMedia.title = title;
        await getMedia.save();

        return response(true, 200, "Media updated successfully");
    } catch (err) {
        return handleCatch(err);
    }
}
