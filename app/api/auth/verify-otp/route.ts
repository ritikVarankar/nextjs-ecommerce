import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { zodSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

interface LoggedInUser {
  _id: string;
  role: string;
  name: string;
  avatar: string;
}


export async function POST(request: Request){
    try {
        await connectDB();
        const validationSchema = zodSchema
        .pick({
            email: true,
            otp:true
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

        const { email, otp } = validateData.data;
        const getOTPData = await OTPModel.findOne({ otp, email });
        if(!getOTPData){
            return response(
                false,
                404,
                "Invalid or expired otp"
            ); 
        }

        // check already resgistered user
        const getUser = await UserModel.findOne({ deletedAt:null, email }).lean<LoggedInUser>();

        if(!getUser){
            return response(
                false,
                404,
                "User not found."
            ); 
        }

        const loggedInUserData ={
            _id: getUser._id.toString(),
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatar,
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT(loggedInUserData)
        .setIssuedAt()
        .setExpirationTime('24h')
        .setProtectedHeader({ alg:'HS256' })
        .sign(secret)

        const cookieStore = await cookies();
        cookieStore.set({
            name:'access_token',
            value:token,
            httpOnly: process.env.NODE_ENV === "production",
            path:'/',
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        });

        // remove otp after validation
        await getOTPData.deleteOne();

        return response(
                true, 
                200,
                "Login Successful.",
                loggedInUserData
            ); 
    } catch (error) {
        return handleCatch(error);
    }
}