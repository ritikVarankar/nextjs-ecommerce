import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import MediaModel from "@/models/media.model";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";


export async function GET(
    request: NextRequest
) {
    try {
        await connectDB();
        const searchParams = request.nextUrl.searchParams;
        // get filters from query params
        const size = searchParams.get('size');
        const color = searchParams.get('color');
        const minPrice = searchParams.get('minPrice') || 0;
        const maxPrice = searchParams.get('maxPrice') || 10000;
        const categorySlug = searchParams.get('category');
        const search = searchParams.get('q');

        // Pagination
        const limit = parseInt(searchParams.get('limit') || "9");
        const page = parseInt(searchParams.get('page') || "9");
        const skip = page * limit;

        // Sorting
        const sortOption = searchParams.get('sort') || 'default_sorting';
        let sortQuery={}
        if(sortOption === 'default_sorting') sortQuery = { createdAt:-1 }
        if(sortOption === 'asc') sortQuery = { name:1 }
        if(sortOption === 'desc') sortQuery = { name:-1 }
        if(sortOption === 'price_low_high') sortQuery = { sellingPrice:1 }
        if(sortOption === 'price_high_low') sortQuery = { sellingPrice:-1 }

        // find category by slug
        let categoryId: string | any[]=[];
        if(categorySlug){
            const slugs = categorySlug.split(',')
            const categoryData = await CategoryModel.find({ deletedAt:null, slug:{ $in: slugs} }).select('_id').lean();
            // if(categoryData) categoryId = categoryData._id
            categoryId = categoryData.map(cat=>cat._id)
        }

        // match Stage
        const matchStage: any = {};
        if(categoryId.length > 0){
            matchStage.category = { $in: categoryId }; // Filter by category 
        }

        if(search){
            matchStage.name = { $regex:search, $options:'i' }
        }

        // aggregate pipeline
        const products = await ProductModel.aggregate([
            { $match:matchStage },
            { $sort:sortQuery },
            { $skip:skip },
            { $limit:limit+1 },
            {
                $lookup:{
                    from:'productvariants',
                    localField:'_id',
                    foreignField:'product',
                    as:'variants'
                }
            },
            {
                $addFields: {
                    variants: {
                    $filter: {
                        input: "$variants",
                        as: "variant",
                        cond: {
                        $and: [
                            size ? { $in: ["$$variant.size", size.split(',')] } : { $literal: true },
                            color ? { $in: ["$$variant.color", color.split(',')] } : { $literal: true },
                            minPrice ? { $gte: ["$$variant.sellingPrice", Number(minPrice)] } : { $literal: true },
                            maxPrice ? { $lte: ["$$variant.sellingPrice", Number(maxPrice)] } : { $literal: true },
                        ],
                        },
                    },
                    },
                },
            },
            {
                $match:{
                    variants: {
                        $ne:[]
                    }
                }
            },
            {
                $lookup:{
                    from:'medias',
                    localField:'media',
                    foreignField:'_id',
                    as:'media'
                }
            },
            {
                $project:{
                    _id: 1,
                    name: 1,
                    slug: 1,
                    mrp: 1,
                    sellingPrice: 1,
                    discountPercentage: 1,
                    media: {
                       _id: 1,
                        secure_url: 1,
                        alt: 1, 
                    },
                    product:{
                        color: 1,
                        mrp: 1,
                        size:1,
                        sellingPrice: 1,
                        discountPercentage: 1
                    }
                }
            }
        ])

        
        // check if more data exists
        let nextPage = null;
        if(products.length > limit){
            nextPage = page + 1;
            products.pop(); // Remove extra item
        }
         return response(
                        true, 
                        200,
                        "Product data found",
                        { products, nextPage }
                    ); 
    } catch (err) {
        return handleCatch(err);
    }
}
