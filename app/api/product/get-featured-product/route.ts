import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";

export async function GET() {
    try {
        await connectDB();

        const getProduct = await ProductModel.find({deleteType:null}).populate('media','_id secure_url').limit(8).lean();
        if (!getProduct) {
            return response(false, 404, "Featured Product not found.");
        }

        return response(true, 200, "Featured Product found.", getProduct);
    } catch (err) {
        return handleCatch(err);
    }
}
