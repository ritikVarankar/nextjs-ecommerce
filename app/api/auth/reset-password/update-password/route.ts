import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function PUT(request:Request){
    try {
        await connectDB();
        const validationSchema = zodSchema
        .pick({
            email: true,
            password:true
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

        const { email, password } = validateData.data;

        // check already resgistered user
        const getUser = await UserModel.findOne({ deletedAt:null, email }).select("+password");

        if(!getUser){
            return response(
                false,
                404,
                "User not found."
            ); 
        }

        getUser.password = password;
        await getUser.save();

        return response(
                true, 
                200,
                "Password update success."
            ); 
    } catch (error) {
        return handleCatch(error);
    }
}