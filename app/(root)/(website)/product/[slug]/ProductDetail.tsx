'use client';
import { Products, ShopProduct, Variant } from "@/types/webAppDataType/types";
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { WEBSITE_CART, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Link from "next/link";
import Image from "next/image";
import { FilePath } from "@/lib/ExportFiles";
import { IoStar } from "react-icons/io5";
import { decode, encode } from "entities";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";
import ProductReview from "@/components/application/Website/ProductReview";

interface ProductDetailProps{
    product:Products;
    variant: Variant
    colors: string[]
    sizes: string[]
    reviewCount: number
}
const ProductDetail = ({ product, variant, colors, sizes, reviewCount }:ProductDetailProps) => {
  const disPatch = useDispatch();
  const cartStore = useSelector((state:RootState)=>state.cartStore);
  const [activeThumb, setActiveThumb] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedIntoCart, setIsAddedIntoCart] = useState<boolean>(false);
  const [isProductLoading, setIsProductLoading] = useState<boolean>(false);
  const handleThumb = (thumbUrl:string)=>{
    setActiveThumb(thumbUrl)
  }
  const handleQuantity =(actionType:string)=>{
    if(actionType === "inc"){
      setQuantity((prev)=>prev + 1)
    }else{
      if(quantity !== 1){
        setQuantity((prev)=>prev - 1)
      }
    }
  }
  const handleAddToCart=()=>{
    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      media: variant.media[0].secure_url,
      qty: quantity
    }

    disPatch(addToCart(cartProduct));
    setIsAddedIntoCart(true);
    showToast('success','Product added into cart');
  }
  useEffect(()=>{
    setActiveThumb(variant.media[0].secure_url);
  },[variant])
  useEffect(()=>{
    if(cartStore.count > 0){
      const existingProduct = cartStore.products.findIndex(
        (prod)=>((prod.productId === product._id) && (prod.variantId === variant._id))
      );
      
      if(existingProduct >= 0){
        setIsAddedIntoCart(true)
      }else{
        setIsAddedIntoCart(false)
      }
    }
    setIsProductLoading(true);
  },[variant])
  return (
    <div className="lg:px-32 px-4">
      {!isProductLoading && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
          <Image
            src={FilePath.loading}
            alt={"loading"}
            width={80}
            height={80}
          />
        </div>
      )}
      <div className="my-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>Product</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
                  {product.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="md:flex justify-between items-start lg:gap-10 gap-5 mb-20">
        <div className="md:w-1/2 xl:flex xl:justify-center xl:gap-5 md:sticky md:top-0">
          <div className="xl:order-last xl:mb-0 mb-5 xl:w-[calc(100%-144px)]">
            <Image
              src={activeThumb || FilePath.imgPlaceholder.src}
              alt="activeThumb"
              width={650}
              height={650}
              className="border rounded max-w-full"
            />
          </div>
          <div className="flex xl:flex-col items-center xl:gap-5 gap-3 xl:w-36 overflow-auto xl:pb-0 pb-2 max-h-[600px]">
            {variant.media.map((thumb) => (
              <Image
                key={thumb._id}
                src={thumb.secure_url || FilePath.imgPlaceholder.src}
                alt="thumb.secure_url"
                width={100}
                height={100}
                onClick={() => handleThumb(thumb.secure_url)}
                className={`md:max-w-full max-w-16 rounded cursor-pointer ${
                  thumb.secure_url.trim() === activeThumb.trim()
                    ? "border-2 border-primary"
                    : "border"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 md:mt-0 mt-5">
          <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
          <div className="flex items-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={`star${i}`} className="text-yellow-400" size={20} />
            ))}
            <span className="text-sm ps-2">({reviewCount} Reviews)</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-semibold">
              {variant.sellingPrice.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
            <span className="text-sm line-through text-gray-500">
              {variant.mrp.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
            <span className="bg-red-500 rounded-2xl px-3 py-1 text-white text-xs ms-5">
              -{variant.discountPercentage}%
            </span>
          </div>
          <div
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: decode(product.description) }}
          ></div>
          <div className="mt-5">
            <p className="mb-2">
              <span className="font-semibold">Color: </span> {variant.color}
            </p>
            <div className="flex gap-5">
              {colors.map((col) => (
                <Link
                  onClick={() => setIsProductLoading(true)}
                  key={col}
                  href={`${WEBSITE_PRODUCT_DETAILS(
                    product.slug
                  )}?color=${col}&size=${variant.size}`}
                  className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary 
                  hover:text-white ${
                    col === variant.color ? "bg-primary text-white" : ""
                  } `}
                >
                  {col}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="mb-2">
              <span className="font-semibold">Size: </span> {variant.size}
            </p>
            <div className="flex gap-5">
              {sizes.map((size) => (
                <Link
                  onClick={() => setIsProductLoading(true)}
                  key={size}
                  href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${
                    variant.color
                  }&size=${size}`}
                  className={`border py-1 px-3 rounded-lg cursor-pointer hover:bg-primary 
                  hover:text-white ${
                    size === variant.size ? "bg-primary text-white" : ""
                  } `}
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="font-bold mb-2">Quantity</p>
            <div className="flex items-center h-10 border w-fit rounded-full">
              <button
                type="button"
                className="h-full w-10 flex justify-center items-center"
                onClick={() => handleQuantity("desc")}
              >
                <HiMinus />
              </button>
              <input
                className="w-14 text-center border-none outline-offset-0"
                readOnly
                type="text"
                value={quantity}
              />
              <button
                type="button"
                className="h-full w-10 flex justify-center items-center"
                onClick={() => handleQuantity("inc")}
              >
                <HiPlus />
              </button>
            </div>
          </div>
          <div className="mt-5">
            {!isAddedIntoCart ? (
              <ButtonLoading
                type="button"
                text={"Add To Cart"}
                className="w-full rounded-full py-6 text-md cursor-pointer"
                onClick={handleAddToCart}
              />
            ) : (
              <Button
                className="w-full rounded-full py-6 text-md cursor-pointer"
                type="button"
                asChild
              >
                <Link href={WEBSITE_CART}>Go To Cart</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="shadow rounded border">
          <div className="p-3 bg-gray-50 border-b">
            <h2 className="font-semibold text-2xl">Product Description</h2>
          </div>
          <div className="p-3" dangerouslySetInnerHTML={{ __html:encode(product.description) }}></div>
        </div>
      </div>

      <ProductReview productId={product._id} />

    
    </div>
  );
};

export default ProductDetail;
