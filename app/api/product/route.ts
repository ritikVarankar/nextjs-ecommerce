import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { FilterQuery, PipelineStage } from "mongoose";
import ProductModel, { ProductType } from "@/models/Product.model";
import { Types } from "mongoose";

// List of allowed filter/sort fields
type FilterableProductFields =
  | "name"
  | "slug"
  | "mrp"
  | "sellingPrice"
  | "discountPercentage"
  | "description";

interface ColumnFilter {
  id: FilterableProductFields;
  value: string;
}

interface SortingOption {
  id: FilterableProductFields;
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
    let matchQuery: FilterQuery<ProductType> = {};

    if (deleteType === "SD") matchQuery.deletedAt = null;
    else if (deleteType === "PD") matchQuery.deletedAt = { $ne: null };

    // Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } },

        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilter,
              options: "i",
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
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
        filter.id === "mrp" ||
        filter.id === "sellingPrice" ||
        filter.id === "discountPercentage"
      ) {
        matchQuery[filter.id] = Number(filter.value);
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
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
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
          name: 1,
          slug: 1,
          category: "$categoryData.name",
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          media: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Run aggregation
    const getProduct = await ProductModel.aggregate(aggregatePipeline);

    // Count total rows
    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProduct,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
