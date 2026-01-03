import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { FilterQuery, PipelineStage } from "mongoose";
import ReviewModel, { ReviewType } from "@/models/Review.model";

// List of allowed filter/sort fields
type FilterableReviewFields =
  | "product"
  | "user"
  | "rating"
  | "title"
  | "review";

interface ColumnFilter {
  id: FilterableReviewFields;
  value: string;
}

interface SortingOption {
  id: FilterableReviewFields;
  desc: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Auth
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    // Parse search params
    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    const filters: ColumnFilter[] = JSON.parse(
      searchParams.get("filters") || "[]"
    );

    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting: SortingOption[] = JSON.parse(
      searchParams.get("sorting") || "[]"
    );

    const deleteType = searchParams.get("deleteType");

    // Match query
    let matchQuery: FilterQuery<ReviewType> = {};

    if (deleteType === "SD") matchQuery.deletedAt = null;
    else if (deleteType === "PD") matchQuery.deletedAt = { $ne: null };

    // Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { "productData.title": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { rating: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } }
      ];
    }



    // Column filters
    filters.forEach((filter) => {
      if (
        filter.id === "product"
      ) {
        matchQuery['productData.name'] = {
          $regex: filter.value,
          $options: "i",
        }
      }else if (
        filter.id === "user"
      ) {
        matchQuery['userData.name'] = {
          $regex: filter.value,
          $options: "i",
        }
      } else {
        matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
      }
    });

    // Sorting
    const sortQuery: Record<string, 1 | -1> = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // Aggregation pipeline
    const aggregatePipeline: PipelineStage[] = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
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
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product:"$productData.name",
          user:"$userData.name",
          rating:1,
          title:1,
          review:1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Run aggregation
    const getReviews = await ReviewModel.aggregate(aggregatePipeline);

    // Count total rows
    const totalRowCount = await ReviewModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getReviews,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
