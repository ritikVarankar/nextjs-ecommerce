import { emailVerificationLink } from "@/email/emailVerificationLink";
import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import OrderModel from "@/models/Order.model";
import { NextRequest } from "next/server";
import Razorpay from 'razorpay';
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    // Connect to the database
    await connectDB();

    // Extract fields from the payload
    const {
      name,
      email,
      phone,
      country,
      state,
      city,
      pincode,
      landmark,
      ordernote,
      userId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      subtotal,
      discount,
      couponDiscount, // This is the field in question
      totalAmount,
      products
    } = payload;

    // Check for missing required fields
    const missingFields: string[] = [];

    // Add missing fields to the array
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!country) missingFields.push("country");
    if (!state) missingFields.push("state");
    if (!city) missingFields.push("city");
    if (!pincode) missingFields.push("pincode");
    if (!landmark) missingFields.push("landmark");
    if (subtotal == undefined) missingFields.push("subtotal");
    if (discount == undefined) missingFields.push("discount");
    if (couponDiscount == undefined) missingFields.push("couponDiscount"); // Allow 0 but check if it's missing
    if (totalAmount == undefined) missingFields.push("totalAmount");
    if (!razorpay_payment_id) missingFields.push("razorpay_payment_id");
    if (!razorpay_order_id) missingFields.push("razorpay_order_id");
    if (!razorpay_signature) missingFields.push("razorpay_signature");
    if (!Array.isArray(products) || products.length === 0) missingFields.push("products");

    // If any fields are missing, return a detailed error response
    if (missingFields.length > 0) {
      return response(false, 400, `Missing or invalid fields: ${missingFields.join(", ")}`, null);
    }

    // Verify Razorpay payment signature
    const verification = validatePaymentVerification(
      {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      },
      razorpay_signature,
      process.env.RAZORPAY_SECRET_KEY || ""
    );

    let paymentVerification = false;
    if (verification) {
      paymentVerification = true;
    }

    // Create new order in the database
    const newOrder = await OrderModel.create({
      user: userId,
      name,
      email,
      phone,
      country,
      state,
      city,
      pincode,
      landmark,
      ordernote,
      products,
      subtotal,
      discount,
      couponDiscount, // Ensure couponDiscount is passed as it is
      totalAmount,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      orderstatus: paymentVerification ? 'pending' : 'unverified'
    });

    // Send confirmation email
    try {
      const mailData = {
        order_id: razorpay_order_id,
        orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${razorpay_order_id}`
      };
      await sendMail("Order Placed Successfully", email, orderNotification(mailData));
    } catch (error) {
      console.log("Error sending confirmation email:", error);
    }

    // Return successful response
    return response(true, 200, "Order placed successfully.");
  } catch (error) {
    // Handle any unexpected errors
    return handleCatch(error);
  }
}


