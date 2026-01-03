import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";

export async function GET() {
    try {
        const auth = await isAuthenticated("admin");
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized.");
        }

        await connectDB();

        const filter= {
            deletedAt: null,
        };

        const getProduct = await ProductModel.find(filter).select('-media -description').sort({ createdAt: -1 }).lean();
        if(!getProduct){
            return response(false, 404, "Collection empty.")
        }

        return response(true, 200, "Data found.", getProduct);
    } catch (err) {
        return handleCatch(err);
    }
}
