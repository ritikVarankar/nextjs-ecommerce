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

    const orderStatus = await OrderModel.aggregate([
      {
        $match:{
          deletedAt:null
        }
      },
      {
        $group:{
          _id: '$orderstatus',
          count: { $sum:1 }
        }
      },
      {
        $sort: { count:1 }
      }
    ])

    return response(
      true, 
      200,
      "Data Found.",
        orderStatus
    ); 

    
  } catch (err) {
    return handleCatch(err);
  }
}
