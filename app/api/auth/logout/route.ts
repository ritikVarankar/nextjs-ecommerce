import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import z from "zod";

export async function POST(request:Request) {
    try {
        await connectDB();
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        
        return response(
                true, 
                200,
                "Logout successful"
            );  
    } catch (error) {
        return handleCatch(error);
    }
}
