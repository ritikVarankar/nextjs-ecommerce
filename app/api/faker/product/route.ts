import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";

import { response } from "@/lib/helperFunction";
import { connectDB } from "@/lib/database-connection";
import MediaModel from "@/models/media.model";

/**
 * Get random items from an array
 */
function getRandomItems<T>(array: T[], count = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function POST(_req: NextRequest) {
  try {
    await connectDB();

    // Fetch all categories
    const categories = await CategoryModel.find();
    if (!categories.length) {
      return response(false, 400, "No categories found!");
    }

    // Fetch all media
    const mediaList = await MediaModel.find();
    const mediaIds = mediaList.map((media) => media._id);

    const colors = ["Red", "Blue", "Green", "Black"];
    const sizes = ["S", "M", "L", "XL", "2XL"];

    const products: any[] = [];
    const variants: any[] = [];

    for (const category of categories) {
      for (let i = 0; i < 5; i++) {
        const mrp = Number(faker.commerce.price({ min: 500, max: 2000, dec: 0 }));
        const discountPercentage = faker.number.int({ min: 10, max: 50 });
        const sellingPrice = Math.round(
          mrp - (mrp * discountPercentage) / 100
        );

        const productId = new mongoose.Types.ObjectId();
        const productSlug = faker.lorem.slug();
        const selectedMedia = getRandomItems(mediaIds, 4);

        const product = {
          _id: productId,
          name: faker.commerce.productName(),
          slug: productSlug,
          category: category._id,
          mrp,
          sellingPrice,
          discountPercentage,
          media: selectedMedia,
          description: faker.commerce.productDescription(),
          deletedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        products.push(product);

        // Generate variants (4 colors × 5 sizes)
        for (const color of colors) {
          for (const size of sizes) {
            variants.push({
              _id: new mongoose.Types.ObjectId(),
              product: productId,
              color,
              size,
              mrp,
              sellingPrice,
              discountPercentage,
              sku: `${productSlug}-${color}-${size}-${faker.number.int({
                min: 1000,
                max: 9999,
              })}`,
              stock: faker.number.int({ min: 10, max: 100 }),
              media: getRandomItems(mediaIds, 4),
              deletedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
      }
    }

    // Insert into DB
    await ProductModel.insertMany(products);
    await ProductVariantModel.insertMany(variants);

     return response(true, 200, 'Fake data generated successfully.')
  } catch (error: any) {
    return response(false, 500, error.message)
  }
}
