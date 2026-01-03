import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function GET() {
    try {

        await connectDB();


        // const getProductVariantSizes = await ProductVariantModel.distinct('size');
        const getProductVariantSizes = await ProductVariantModel.aggregate([
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

        if (!getProductVariantSizes.length) {
            return response(false, 404, "Sizes not found.");
        }

        const sizes = getProductVariantSizes.map((item)=>item.size)

        return response(true, 200, "Sizes found.", sizes);
    } catch (err) {
        return handleCatch(err);
    }
}
