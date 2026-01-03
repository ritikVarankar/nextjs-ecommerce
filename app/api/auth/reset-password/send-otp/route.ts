import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request:Request){
    try {
        await connectDB();
        const validationSchema = zodSchema
        .pick({
            email: true
        })
        const payload = await request.json();
        const validateData = validationSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                401,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const { email } = validateData.data;
        // check already resgistered user
        const getUser = await UserModel.findOne({ email });

        if(!getUser){
            return response(
                false,
                404,
                "User not found."
            ); 
        }

        // remove otps
        await OTPModel.deleteMany({ email });
        const otp = generateOTP();
        const newOtpData = new OTPModel({
            email, otp
        });
        await newOtpData.save();
        
        const otpSendStatus = await sendMail(`Your login verification code`,email, otpEmail(otp));
        if(!otpSendStatus.success){
            return response(
                false,
                400,
                "Failed to send otp."
            );  
        }

        return response(
                true, 
                200,
                "Please verify your account."
            ); 
    } catch (error) {
        return handleCatch(error);
    }
}