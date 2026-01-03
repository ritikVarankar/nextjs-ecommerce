import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { isAuthenticated } from "@/lib/authentication";

export async function POST(request:Request) {
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
        const newMedia = await MediaModel.insertMany(payload);
        return response(
                true,
                200,
                "Media Uploaded Successfully",
                newMedia
            );
    } catch (err:unknown) {
        const error = err as { cloudinary?: unknown }; // extend safely
        if(payload && payload.length > 0){
            const publicIds = payload.map((dt: { public_id: string; })=>dt.public_id);
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        return handleCatch(error)
    }
}