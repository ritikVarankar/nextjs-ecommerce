import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { FilterQuery, PipelineStage } from "mongoose";
import CouponModel, { CouponType } from "@/models/Coupon.model";
import OrderModel from "@/models/Order.model";

// List of allowed filter/sort fields
type FilterableCouponFields =
  'order_id' |
  'payment_id' |
  'name' |
  'email' |
  'phone' |
  'country' |
  'state' |
  'city' |
  'pincode' |
  'landmark' |
  'subtotal' |
  'discount' |
  'couponDiscount' |
  'totalAmount' ;

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
        { order_id: { $regex: globalFilter, $options: "i" } },
        { payment_id: { $regex: globalFilter, $options: "i" } },
        { name: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { country: { $regex: globalFilter, $options: "i" } },
        { state: { $regex: globalFilter, $options: "i" } },
        { city: { $regex: globalFilter, $options: "i" } },
        { pincode: { $regex: globalFilter, $options: "i" } },
        { landmark: { $regex: globalFilter, $options: "i" } },
        { subtotal: { $regex: globalFilter, $options: "i" } },
        { discount: { $regex: globalFilter, $options: "i" } },
        { couponDiscount: { $regex: globalFilter, $options: "i" } },
        { totalAmount: { $regex: globalFilter, $options: "i" } },
        { orderstatus: { $regex: globalFilter, $options: "i" } }
        
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
          order_id: 1,
          payment_id: 1,
          name: 1,
          email: 1,
          phone: 1,
          country: 1,
          state: 1,
          city: 1,
          pincode: 1,
          landmark: 1,
          subtotal: 1,
          discount: 1,
          couponDiscount: 1,
          totalAmount: 1,
          orderstatus: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    // Run aggregation
    const getOrders = await OrderModel.aggregate(aggregatePipeline);

    // Count total rows
    const totalRowCount = await OrderModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getOrders,
      meta: { totalRowCount },
    });
  } catch (err) {
    return handleCatch(err);
  }
}
