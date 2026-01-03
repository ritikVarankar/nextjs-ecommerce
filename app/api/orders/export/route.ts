import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";
import OrderModel from "@/models/Order.model";


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

        const getOrders = await OrderModel.find(filter).select('-products').sort({ createdAt: -1 }).lean();
        if(!getOrders){
            return response(false, 404, "Collection empty.")
        }

        return response(true, 200, "Data found.", getOrders);
    } catch (err) {
        return handleCatch(err);
    }
}
