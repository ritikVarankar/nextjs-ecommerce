'use client'
import FilterComponent from "@/components/application/Website/Filter";
import Sorting from "@/components/application/Website/Sorting";
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import useWindowSize from "@/hooks/useWindowSize";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { FeaturedProductDataType, ShopProductResponse } from "@/types/webAppDataType/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import ProductBox from "@/components/application/Website/ProductBox";
import { ButtonLoading } from "@/components/application/ButtonLoading";

const breadcrumb = {
  title:'Shop',
  links:[
    {
      label:'Shop',
      href:WEBSITE_SHOP
    }
  ]
}
function Shop() {
  const searchParams = useSearchParams().toString()
  const [limit,setLimit] = useState<number>(9)
  const [sorting,setSorting] = useState<string>('default_sorting')
  const [mobileFilterOpen,setMobileFilterOpen] = useState<boolean>(false);
  const windowSize = useWindowSize();
  const fetchProduct=async(pageParam:number)=>{
    const {data:getProduct} = await axios.get<ShopProductResponse>(`/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`);
    // console.log("getProduct=",getProduct);
    if(!getProduct.success){
      return [];
    }
    return getProduct.data
  }

  const {
    error, data, isFetching, fetchNextPage, hasNextPage 
  } = useInfiniteQuery({
    queryKey:['products', limit, sorting, searchParams],
    queryFn: async({ pageParam })=> await fetchProduct(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage:any) => lastPage.nextPage ?? undefined,
});
  return (
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      <section className="lg:flex lg:px-32 px-4 my-20">
        {
          windowSize.width > 1024 ? (
          <div className="w-72 me-4">
            <div className="sticky top-0 bg-gray-50 p-4 rounded">
              <FilterComponent />
            </div>
          </div>
          ) : (
          <Sheet open={mobileFilterOpen} onOpenChange={()=>setMobileFilterOpen(false)}>
            <SheetTrigger>Open</SheetTrigger>
            <SheetContent side="left" className="block">
              <SheetHeader className="border-b">
                <SheetTitle>Filter</SheetTitle>
                <div className="p-4 overflow-auto h-[calc(100vh-80px)]">
                  <FilterComponent />
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          )
        }
        
        
        <div className="lg:w-[calc(100%-18rem)]">
          <Sorting limit={limit} setLimit={setLimit} sorting={sorting} setSorting={setSorting} mobileFilterOpen={mobileFilterOpen} setMobileFilterOpen={setMobileFilterOpen} />
          {
            isFetching && (
              <div className="p-3 font-semibold text-center">Loading...</div>
            )
          }
          {
            error && (
              <div className="p-3 font-semibold text-center">{error.message}</div>
            )
          }
          <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 mt-10">
            {
              data && data?.pages.map((page:any)=>(
                page.products.map((product:FeaturedProductDataType)=>(
                  <ProductBox key={product._id} product={product} />
                ))
              ))
            }
          </div>

          <div className="flex justify-center mt-10">
            {
              hasNextPage ? (
                <ButtonLoading type={"button"} text={"Load More"} loading={isFetching}   onClick={(e) => {
                  e.preventDefault();
                  fetchNextPage();
                }}  />
              ) : (
                <>
                  {!isFetching && <>No more data to load.</>}
                </>
              )
            }

          </div>

        </div>
      </section>
    </div>
  );
}

export default Shop;
