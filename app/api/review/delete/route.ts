import cloudinary from "@/lib/cloudinary";
import mongoose from "mongoose"
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { isAuthenticated } from "@/lib/authentication";
import ReviewModel from "@/models/Review.model";

export async function PUT(request:Request) {
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
        const payload = await request.json();
        const ids = payload.ids || [];
        const deleteType = payload.deleteType;
        if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, "Invalid or empty id list.")
        }

        const reviewsData = await ReviewModel.find({ _id: { $in:ids } }).lean();
        if(!reviewsData.length){
            return response(false, 404, "Data not found.")
        }

        if(!['SD','RSD'].includes(deleteType)){
            return response(false, 400, "Invalid delete operation. Delete type should be SD or RSD for this route."); 
        }

        if(deleteType === "SD"){
            await ReviewModel.updateMany({ _id: { $in:ids }},{ $set: { deletedAt: new Date().toISOString() } })
        }else{
            await ReviewModel.updateMany({ _id: { $in:ids }},{ $set: { deletedAt: null } })
        }
        
        return response(true, 200, deleteType === 'SD' ? 'Data moved into trash' : 'Data restored')
    } catch (err:unknown) {
        const error = err as { cloudinary?: unknown }; // extend safely
        return handleCatch(error)
    }
}

export async function DELETE(request:Request) {
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
        const payload = await request.json();
        const ids = payload.ids || [];
        const deleteType = payload.deleteType;

        if(!Array.isArray(ids) || ids.length === 0){
            return response(false, 400, "Invalid or empty id list.")
        }

        const reviewsData = await ReviewModel.find({ _id: { $in:ids } }).lean();
        if(!reviewsData.length){
            return response(false, 404, "Data not found.")
        }

        if(!(deleteType === "PD")){
            return response(false, 400, "Invalid delete operation. Delete type should be PD for this route."); 
        }
        
        await ReviewModel.deleteMany({ _id: { $in:ids }});
        
      
 
        return response(true, 200, 'Data deleted permanently')
    } catch (err:unknown) {
        const error = err as { cloudinary?: unknown }; // extend safely
        return handleCatch(error)
    }
}