import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import OrderModel from "@/models/Order.model";


export async function GET(request: NextRequest) {
  try {
    // Auth
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const latestorder = await OrderModel.find({deletedAt:null})
    .sort({createdAt: -1})
    .limit(20)
    .lean()

    return response(
      true, 
      200,
      "Data Found.",
        latestorder
    ); 

    
  } catch (err) {
    return handleCatch(err);
  }
}
