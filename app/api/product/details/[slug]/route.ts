import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.model";

interface RouteParams {
    slug: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<RouteParams> }
) {
    try {
       
        await connectDB();

        const { slug } = await params;
        const searchParams = request.nextUrl.searchParams;
        const size = searchParams.get('size');
        const color = searchParams.get('color');

        const filter: { deletedAt: null; slug?: string } = {
            deletedAt: null,
        };

        if (!slug) {
            return response(false, 404, "Product not found");
        }
        filter.slug= slug;


        const getProduct = await ProductModel.findOne(filter).populate('media','secure_url').lean() as any;

        if (!getProduct) {
            return response(false, 404, "Product not found.");
        }

        // get product variant
        const variantFilter:any={
            product: getProduct._id
        }

        if(size){
            variantFilter.size = size
        }

        if(color){
            variantFilter.color = color
        }

        const variant = await ProductVariantModel.findOne(variantFilter).populate('media','secure_url').lean();
        if(!variant){
            return response(false, 404, "Product Variant not found.");
        }

        // get color and size
        const getColor = await ProductVariantModel.distinct('color', { product: getProduct._id })
        const getSize = await ProductVariantModel.aggregate([
            { $match: { product: getProduct._id } },
            { $sort: { _id:1 } },
            {
                $group:{
                    _id:"$size",
                    first:{ $first:"$_id" }
                }
            },
            { $sort: { first:1 } },
            { $project: { _id:0, size:"$_id"  } },
        ]);

        // get review
        const review = await ReviewModel.countDocuments({ product: getProduct._id });

        const productData = {
            products: getProduct,
            variant: variant,
            colors: getColor,
            sizes: getSize.length ? getSize.map(item=>item.size) : [],
            reviewCount:review
        }

        return response(true, 200, "Product found.", productData);
    } catch (err) {
        return handleCatch(err);
    }
}
