import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { FilterQuery, PipelineStage } from "mongoose";
import CouponModel, { CouponType } from "@/models/Coupon.model";

// List of allowed filter/sort fields
type FilterableCouponFields =
  | "code"
  | "minShoppingAmount"
  | "validity"
  | "discountPercentage";

interface ColumnFilter {
  id: FilterableCouponFields;
  value: string;
}

interface SortingOption {
  id: FilterableCouponFields;
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
    let matchQuery: FilterQuery<CouponType> = {};

    if (deleteType === "SD") matchQuery.deletedAt = null;
    else if (deleteType === "PD") matchQuery.deletedAt = { $ne: null };

    // Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { code: { $regex: globalFilter, $options: "i" } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$minShoppingAmount" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$discountPercentage" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
      ];
    }



    // Column filters
    filters.forEach((filter) => {
      if (
        filter.id === "minShoppingAmount" ||
        filter.id === "discountPercentage"
      ) {
        matchQuery[filter.id] = Number(filter.value);
      } else if(filter.id === "validity") {
        matchQuery[filter.id] = new Date(filter.value)
      }else {
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
      
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          code: 1,
          minShoppingAmount: 1,
          discountPercentage: 1,
          validity: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Run aggregation
    const getCoupon = await CouponModel.aggregate(aggregatePipeline);

    // Count total rows
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCoupon,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
