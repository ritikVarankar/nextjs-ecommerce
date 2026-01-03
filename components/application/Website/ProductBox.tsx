import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { FeaturedProductDataType } from "@/types/webAppDataType/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductBoxProps{
    product:FeaturedProductDataType;
}

const ProductBox = ({ product }:ProductBoxProps) => {
  return (
    <div className="rounded-lg hover:shadow-lg border overflow-hidden">
        <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
            <Image className="w-full lg:h-[300px] md:h-[200px] h-[150px] object-cover object-top" src={product.media[0].secure_url} width={400} height={400} alt={product.media[0]._id || product.name} title={product.media[0]._id || product.name} />
            <div className="p-3 border-t">
                <h4>{product.name}</h4>
                <p className="flex gap-2 text-sm mt-2">
                    <span className="line-through text-gray-400">{product.mrp.toLocaleString('en-IN',{style:'currency',currency:'INR'})}</span>
                    <span className="font-semibold">{product.sellingPrice.toLocaleString('en-IN',{style:'currency',currency:'INR'})}</span>
                </p>
            </div>
        </Link>
    </div>
  );
};

export default ProductBox;
