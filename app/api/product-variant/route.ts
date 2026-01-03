import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { FilterQuery, PipelineStage } from "mongoose";
import ProductModel, { ProductType } from "@/models/Product.model";
import { Types } from "mongoose";
import ProductVariantModel from "@/models/ProductVariant.model";

// List of allowed filter/sort fields
type FilterableProductVariantFields =
  | "product"
  | "sku"
  | "size"
  | "mrp"
  | "sellingPrice"
  | "discountPercentage"
  | "color";

interface ColumnFilter {
  id: FilterableProductVariantFields;
  value: string;
}

interface SortingOption {
  id: FilterableProductVariantFields;
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
        { color: { $regex: globalFilter, $options: "i" } },
        { size: { $regex: globalFilter, $options: "i" } },
        { sku: { $regex: globalFilter, $options: "i" } },
        { "productData.name": { $regex: globalFilter, $options: "i" } },

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
      }else if(filter.id == 'product'){
        matchQuery["productData.name"]= {
          $regex: filter.value,
          $options: "i",
        };
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
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          color: 1,
          sku: 1,
          size:1,
          product: "$productData.name",
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          media: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Run aggregation
    const getProductVariant = await ProductVariantModel.aggregate(aggregatePipeline);

    // Count total rows
    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProductVariant,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
