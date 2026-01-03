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
    const page = parseInt(searchParams.get("page") || "0", 10);
    const limit = 2;
    const skip = page * limit;

    // ✅ Validate productId
    if (!productId || !isValidObjectId(productId)) {
      return response(false, 400, "Invalid product id");
    }

    const matchQuery = {
      deletedAt: null,
      product: new mongoose.Types.ObjectId(productId),
    };

    const aggregation: PipelineStage[] = [
      { $match: matchQuery }, // ✅ move match first
      { $sort: { createdAt: -1 } },
      { $skip: skip },        // ✅ pagination
      { $limit: limit + 1 },  // ✅ check next page
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          avatar: "$userData.avatar",
          reviewedBy: "$userData.name",
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
        },
      },
    ];

    const reviews = await ReviewModel.aggregate(aggregation);
    // Count total rows
    const totalReview = await ReviewModel.countDocuments(matchQuery);

    let nextPage: number | null = null;
    if (reviews.length > limit) {
      nextPage = page + 1;
      reviews.pop();
    }

    return response(true, 200, "Review found.", { reviews, nextPage, totalReview });
  } catch (err) {
    return handleCatch(err);
  }
}
