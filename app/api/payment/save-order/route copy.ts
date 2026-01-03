import { emailVerificationLink } from "@/email/emailVerificationLink";
import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zodSchema } from "@/lib/zodSchema";
import OrderModel from "@/models/Order.model";
import { NextRequest } from "next/server";
import Razorpay from 'razorpay';
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import z from "zod";

export async function POST(request:NextRequest) {
    const payload = await request.json();
    try {
        await connectDB();

        const productSchema = z.object({
            productId: z.string().trim().min(1, "productId is required"),
            variantId: z.string().trim().min(1, "variantId is required"),
            qty: z.string().trim().min(1, "minShoppingAmount is required"),
            mrp: z.string() .min(1, "MRP is required"),
            sellingPrice: z.string().min(1, "Selling Price is required"),
            name: z.string().min(2, "Name must be at least 2 characters long")
        })


        const orderPaymentSchema = zodSchema.pick({
          name: true,
          email:true,
          phone: true,
          country:true,
          state: true,
          city:true,
          pincode: true,
          landmark:true,
          ordernote:true
        }).extend({
          userId: z.string().optional(),
          razorpay_payment_id: z.string().min(3, "payment id is required"),
          razorpay_order_id: z.string().min(3, "order id is required"),
          razorpay_signature: z.string().min(3, "signature is required"),
          subtotal: z.string().min(1, "subtotal is required"),
          discount: z.string().min(1, "discount is required"),
          couponDiscount: z.string().min(1, "couponDiscount is required"),
          totalAmount: z.string().min(1, "totalAmount is required"),
          products:z.array(productSchema)
        })

        const validate = orderPaymentSchema.safeParse(payload);
        if (!validate.success) {
            return response(
                false,
                400,
                "Invalid or missing inputs field.",
                validate.error
            );
        }

        const validateData = validate.data;
        const verification = validatePaymentVerification(
            {
                order_id: validateData.razorpay_order_id,
                payment_id: validateData.razorpay_payment_id
            },
            validateData.razorpay_signature,
            process.env.RAZORPAY_SECRET_KEY || ""
        )

        let paymentVerification =  false
        if(verification){
            paymentVerification = true
        }

        const newOrder = await OrderModel.create({
            user:validateData.userId,
            name:validateData.name,
            email:validateData.email,
            phone:validateData.phone,
            country:validateData.country,
            state:validateData.state,
            city:validateData.city,
            pincode:validateData.pincode,
            landmark:validateData.landmark,
            ordernote:validateData.ordernote,
            products:validateData.products,
            subtotal:validateData.subtotal,
            discount:validateData.discount,
            couponDiscount:validateData.couponDiscount,
            totalAmount:validateData.totalAmount,
            payment_id:validateData.razorpay_payment_id,
            order_id:validateData.razorpay_order_id,
            orderstatus: paymentVerification ? 'pending' : 'unverified'
        })

        try {
            const mailData = {
                order_id:validateData.razorpay_order_id,
                orderDetailsUrl:`${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${validateData.razorpay_order_id}`
            }
            await sendMail("Order Placed Successfully",validateData.email, orderNotification(mailData))
            
        } catch (error) {
            
        }

        return response(
            true,
            200,
            "Order placed Successfully"
        );
    } catch (error) {
        return handleCatch(error)
    }
}