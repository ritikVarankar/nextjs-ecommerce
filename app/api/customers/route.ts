import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { FilterQuery, PipelineStage } from "mongoose";
import UserModel, { UserType } from "@/models/User.model";

// List of allowed filter/sort fields
type FilterableCustomersFields =
  | "name"
  | "email"
  | "phone"
  | "address"
  | "isEmailVerified";

interface ColumnFilter {
  id: FilterableCustomersFields;
  value: string;
}

interface SortingOption {
  id: FilterableCustomersFields;
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
    let matchQuery: FilterQuery<UserType> = {};

    if (deleteType === "SD") matchQuery.deletedAt = null;
    else if (deleteType === "PD") matchQuery.deletedAt = { $ne: null };

    // Global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { address: { $regex: globalFilter, $options: "i" } },
        { isEmailVerified: { $regex: globalFilter, $options: "i" } }
      ];
    }



    // Column filters
    filters.forEach((filter) => {
      matchQuery[filter.id] = {
          $regex: filter.value,
          $options: "i",
        };
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
          name: 1,
          email: 1,
          phone: 1,
          address: 1,
          avatar: 1,
          isEmailVerified: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Run aggregation
    const getCustomers = await UserModel.aggregate(aggregatePipeline);

    // Count total rows
    const totalRowCount = await UserModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCustomers,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
