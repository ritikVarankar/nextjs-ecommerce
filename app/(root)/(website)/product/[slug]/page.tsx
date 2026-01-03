import { ProductDetailReponse } from "@/types/webAppDataType/types";
import axios from "axios";
import React from "react";
import ProductDetail from "./ProductDetail";

interface ProductPageProps {
  params: {
    slug: string; // or id: string, based on your route
  };
  searchParams: {
    size?: string;
    color?: string;
  };
}

const ProductPage = async({ params, searchParams }: ProductPageProps) => {
  const { slug } = await params;
  const { size, color } = await searchParams;
  let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/details/${slug}`;
  if(color && size){
    url += `?color=${color}&size=${size}`
  }
  const { data:getProduct } = await axios.get<ProductDetailReponse>(url);
  if(!getProduct.success){
    return(
      <div className="flex justify-center items-center py-10 h-[300px]">
        <h1 className="text-4xl font-semibold">Data not found</h1>
      </div>
    )
  }

  return (
    <ProductDetail product={getProduct.data.products} variant={getProduct.data.variant} colors={getProduct.data.colors} sizes={getProduct.data.sizes} reviewCount={getProduct.data.reviewCount} />
  );
};

export default ProductPage;
