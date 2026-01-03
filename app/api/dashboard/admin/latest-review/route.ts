import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import OrderModel from "@/models/Order.model";
import ReviewModel from "@/models/Review.model";


export async function GET(request: NextRequest) {
  try {
    // Auth
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const latestreview = await ReviewModel.find({deletedAt:null})
    .sort({createdAt: -1})
    .populate({
      path:'product',
      select:'name media',
      populate:{
        path:'media',
        select:'secure_url'
      }
    })

    return response(
      true, 
      200,
      "Data Found.",
        latestreview
    ); 

    
  } catch (err) {
    return handleCatch(err);
  }
}
