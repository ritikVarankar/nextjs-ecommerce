import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";

export async function GET(request:NextRequest) {
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
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') ?? "0", 10);
        const limit = parseInt(searchParams.get('limit') ?? "10", 10);

        
        // SD=> Soft Delete, RSD=> Restore Soft Delete, PD=> Permanent Delete
        const deleteType = searchParams.get('deleteType');
        let filter={}
        if(deleteType === 'SD'){
            filter= { deletedAt:null }
        }else if(deleteType === 'PD'){
            filter= { deletedAt:{ $ne:null } }
        } 

        const mediaData = await MediaModel.find(filter)
                                .sort({ createdAt:-1 })
                                .skip(page*limit)
                                .limit(limit).lean();
        
        const totalMedia = await MediaModel.countDocuments(filter);


        return NextResponse.json({
            mediaData:mediaData,
            hasMore: ((page + 1)*limit) < totalMedia
        });
    } catch (err) {
        return handleCatch(err)
    }
}