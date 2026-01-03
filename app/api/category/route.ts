import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel, { CategoryType } from "@/models/Category.model";
import { FilterQuery, PipelineStage } from "mongoose";

interface ColumnFilter {
  id: keyof CategoryType;
  value: string;
}

interface SortingOption {
  id: keyof CategoryType;
  desc: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    const filters: ColumnFilter[] = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting: SortingOption[] = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    // Build match query
    let matchQuery: FilterQuery<CategoryType> = {};

    if (deleteType === "SD") matchQuery.deletedAt = null;
    else if (deleteType === "PD") matchQuery.deletedAt = { $ne: null };

    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // Column filters
    filters.forEach((filter) => {
      matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    });

    // Sorting
    const sortQuery: Record<string, 1 | -1> = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // Aggregate pipeline
    const aggregatePipeline: PipelineStage[] = [
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Execute query
    const getCategory = await CategoryModel.aggregate(aggregatePipeline);

    // Get total row count
    const totalRowCount = await CategoryModel.countDocuments(matchQuery);

    return NextResponse.json({
      success:true,
      data: getCategory,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
