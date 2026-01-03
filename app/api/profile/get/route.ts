import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

export async function GET() {
    try {
        const auth = await isAuthenticated('user');
        if(!auth.isAuth){
            return response(
                false,
                403,
                "Unauthorized."
            ); 
        }
        await connectDB();

        const userId = auth.userId;

        const user = await UserModel.findById(userId).lean();

        return response(true, 200, "Profile data.", user);
    } catch (err) {
        return handleCatch(err);
    }
}
