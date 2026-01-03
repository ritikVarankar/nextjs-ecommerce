import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
import mongoose, { isValidObjectId, PipelineStage  } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    // ✅ Validate productId
    if (!productId) {
      return response(false, 400, "Invalid product id");
    }

    const matchQuery = {
      deletedAt: null,
      product: new mongoose.Types.ObjectId(productId),
    };

    const aggregation: PipelineStage[] = [
      { $match: matchQuery }, // ✅ move match first
      { $group: { _id:'$rating', count: { $sum:1 } } },
      { $sort: { createdAt: -1 } }
    ];

    const reviews = await ReviewModel.aggregate(aggregation);
    // Count total rows
    const totalReview = reviews.reduce((sum,r)=>sum+r.count, 0);

    // average rating
    const averageRating = totalReview > 0 ? (reviews.reduce((sum,r)=> sum + r._id * r.count, 0) / totalReview).toFixed(1): "0.0";

    const rating =  reviews.reduce((acc,r)=>{
      acc[r._id] = r.count
      return acc
    },{})

    const percentage =  reviews.reduce((acc,r)=>{
      acc[r._id] = (r.count / totalReview) * 100
      return acc
    },{})

    return response(true, 200, "Review found.", { reviews, totalReview, averageRating, rating, percentage });
  } catch (err) {
    return handleCatch(err);
  }
}
