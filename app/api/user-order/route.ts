import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import OrderModel from "@/models/Order.model";

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

        // getRecentOrders
        const orders = await OrderModel.find({user:userId})
        .populate('products.productId','name slug')
        .populate({
            path: 'products.variantId',
            populate: { path:'media' }
        })
        return response(true, 200, "Dashboard info.", orders);
    } catch (err) {
        return handleCatch(err);
    }
}
