import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import OrderModel from "@/models/Order.model";

interface RouteParams {
    orderid: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
) {
    try {

        await connectDB();

        const { orderid } = await params;

        if (!orderid) {
            return response(false, 400, "Order not found");
        }


        const getOrderDetails = await OrderModel.findOne({ order_id:orderid })
        .populate('products.productId','name slug')
        .populate({
            path: 'products.variantId',
            populate: { path:'media' }
        })

        if (!getOrderDetails) {
            return response(false, 404, "Order not found.");
        }

        return response(true, 200, "Order found.", getOrderDetails);
    } catch (err) {
        return handleCatch(err);
    }
}
