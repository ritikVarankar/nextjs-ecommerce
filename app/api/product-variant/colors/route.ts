import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";


export async function GET() {
    try {

        await connectDB();


        const getProductVariantColors = await ProductVariantModel.distinct('color');

        if (!getProductVariantColors) {
            return response(false, 404, "Colors not found.");
        }

        return response(true, 200, "Colors found.", getProductVariantColors);
    } catch (err) {
        return handleCatch(err);
    }
}
