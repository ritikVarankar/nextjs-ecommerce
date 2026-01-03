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

    const monthlySales = await OrderModel.aggregate([
      {
        $match:{
          deletedAt:null,
          orderstatus: { $in: ['processing', 'shipped', 'delivered'] }
        }
      },
      {
        $group:{
          _id:{
            year: { $year:'$createdAt' },
            month: { $month:'$createdAt' }
          },
          totalSales: { $sum:'$totalAmount' }
        }
      },
      {
        $sort: { '_id.year':1, '_id.month':1 }
      }
    ])

    return response(
      true, 
      200,
      "Data Found.",
        monthlySales
    ); 

    
  } catch (err) {
    return handleCatch(err);
  }
}
