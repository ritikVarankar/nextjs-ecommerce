import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { RegisterRequest } from "@/types/apidatatype/types";
import { SignJWT } from "jose";

export async function POST(request:Request){
    try {
        await connectDB();
        const validationSchema = zodSchema.pick({
            name:true,
            password:true,
            email: true
        });
        const payload:RegisterRequest = await request.json();
        // const payload = (await request.json()) as RegisterRequest;
        const validateData = validationSchema.safeParse(payload);
        if(!validateData.success){
            return response(false,401,'Invalid or missing inputs field.',validateData.error)
        }
        const {name, email, password} = validateData.data;
        
        // check already resgistered user
        const checkUser = await UserModel.exists({email});
        if(checkUser){
            return response(true,409,'User already registered')
        }

        // new registration
        const NewRegistration = new UserModel({
            name:name, 
            email:email, 
            password:password
        })
        await NewRegistration.save();

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT({ userId:NewRegistration._id.toString() })
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({ alg:'HS256' })
        .sign(secret)

        await sendMail("Email Verification request from Developer Ritik",
            email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))

        return response(true,200,'Registration sucess, please verify your email address.')
    } catch (error) {
        return handleCatch(error)
    }
}