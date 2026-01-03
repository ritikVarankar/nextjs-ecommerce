import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import UserModel from "@/models/User.model";
import OrderModel from "@/models/Order.model";


export async function GET(request: NextRequest) {
  try {
    // Auth
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const [category, product, customer, orders] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt:null }),
      ProductModel.countDocuments({ deletedAt:null }),
      UserModel.countDocuments({ deletedAt:null }),
      OrderModel.countDocuments({ deletedAt:null })
    ])

    return response(
      true, 
      200,
      "Dashboard Count.",
      {
        category,
        product,
        customer,
        orders
      }
    ); 

    
  } catch (err) {
    return handleCatch(err);
  }
}
