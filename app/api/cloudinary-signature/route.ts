
import cloudinary from "@/lib/cloudinary";
import { handleCatch } from "@/lib/helperFunction";
import { CloudinaryRequest } from "@/types/apidatatype/types";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    try {
        const payload:CloudinaryRequest = await request.json();
        const { paramsToSign } = payload;
        const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET_KEY!);
        return NextResponse.json({ signature });
    } catch (error) {
        return handleCatch(error)
    }
}
