import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/database-connection";
import { catchError, generateOTP, handleCatch, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { AppError, LoginRequest } from "@/types/apidatatype/types";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request:Request) {
    try {
        await connectDB();
        const validationSchema = zodSchema
            .pick({
                email: true,
            })
            .extend({
                password: z.string(),
            });
        const payload:LoginRequest = await request.json();

        const validateData = validationSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const { email, password } = validateData.data;

        // check already resgistered user
        const getUser = await UserModel.findOne({ deletedAt:null, email }).select("+password");

        if(!getUser){
            return response(
                false,
                404,
                "Invalid login credentials."
            ); 
        }

        // resend email verification link
        if(!getUser.isEmailVerified){
            const secret = new TextEncoder().encode(process.env.SECRET_KEY)
            const token = await new SignJWT({ userId:getUser._id.toString() })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg:'HS256' })
            .sign(secret)
    
            await sendMail("Email Verification request from Developer Ritik",
                email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

            return response(
                false,
                401,
                "Your email is not verified. We havee sent a verification link to your registered email address."
            );
        }

        // Password Verification
        const isPasswordVerified = await getUser.comparePassword(password);
        if(!isPasswordVerified){
           return response(
                false,
                400,
                "Invalid login credentials."
            );  
        }

        // Otp Generation
        OTPModel.deleteMany({ email }) // deleted old otps

        const otp = generateOTP();
        
        // storing otp into database
        const newOtp = new OTPModel({
            email, otp
        })

        await newOtp.save();

        const otpEmailStatus = await sendMail(`Your login verification code`,email, otpEmail(otp));
        if(!otpEmailStatus.success){
           return response(
                false,
                400,
                "Failed to send otp."
            );  
        }

        return response(
                true, 
                200,
                "Please verify your device."
            );  
    } catch (error) {
        return handleCatch(error);
    }
}
