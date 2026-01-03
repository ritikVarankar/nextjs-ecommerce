import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import OrderModel from "@/models/Order.model";
import { isAuthenticated } from "@/lib/authentication";

export async function PUT(request: NextRequest) {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const { id, status } = await request.json();

        if (!id || !status) {
            return response(false, 400, "Order id and status is required");
        }

        const orderDetails = await OrderModel.findById(id);
        if (!orderDetails) {
            return response(false, 404, "Order not found.");
        }

        orderDetails.orderstatus = status;
        await orderDetails.save();

        return response(true, 200, "Order status updated successfully.", orderDetails);
    } catch (err) {
        return handleCatch(err);
    }
}
