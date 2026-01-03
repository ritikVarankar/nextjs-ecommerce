import { connectDB } from "@/lib/database-connection";
import { handleCatch, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";

export async function GET() {
    try {
        await connectDB();

        const getCategory = await CategoryModel.find({deletedAt: null}).lean();

        if (!getCategory) {
            return response(false, 404, "Category not found.");
        }

        return response(true, 200, "Category found.", getCategory);
    } catch (err) {
        return handleCatch(err);
    }
}
