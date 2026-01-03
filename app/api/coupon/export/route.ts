import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";


export async function GET() {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const filter= {
            deletedAt: null,
        };

        const getCoupon = await CouponModel.find(filter).sort({ createdAt: -1 }).lean();
        if(!getCoupon){
            return response(false, 404, "Collection empty.")
        }

        return response(true, 200, "Data found.", getCoupon);
    } catch (err) {
        return handleCatch(err);
    }
}
