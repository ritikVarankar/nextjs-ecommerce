import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { paymentSchema } from "@/lib/zodSchema";
import { NextRequest } from "next/server";
import Razorpay from 'razorpay';

export async function POST(request:NextRequest) {
    const payload = await request.json();
    try {
        await connectDB();

        const validateData = paymentSchema.safeParse(payload);
        if (!validateData.success) {
            return response(
                false,
                400,
                "Invalid or missing inputs field.",
                validateData.error
            );
        }

        const { amount } = validateData.data;
        const razorpayInstance = new Razorpay({ 
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
            key_secret: process.env.RAZORPAY_SECRET_KEY 
        })

        const razorpayOptions = {
            amount: Number(amount)*100,  // Amount is in currency subunits. 
            currency: "INR"
        };

        const orderDetail = await razorpayInstance.orders.create(razorpayOptions);
        const order_id = orderDetail.id;

        return response(
            true,
            200,
            "Order id generated Successfully",
            order_id
        );
    } catch (error) {
        return handleCatch(error)
    }
}