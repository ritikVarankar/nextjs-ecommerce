'use client'
import useFetch from "@/hooks/useFetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CategoryData } from "@/types/webAppDataType/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider"
import { useEffect, useState } from "react";
import { ButtonLoading } from "../ButtonLoading";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const FilterComponent = () => {
  const { data: categoryData } = useFetch<CategoryData[]>(`/api/category/get-category`);
  const { data: colorsData } = useFetch<string[]>(`/api/product-variant/colors`);
  const { data: sizesData } = useFetch<string[]>(`/api/product-variant/sizes`);
  const searchParams= useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const [priceFilter, setPriceFilter] = useState({minPrice:0, maxPrice:3000})
  const [selectedCategory,setSelectedCategory] = useState<string[]>([]);
  const [selectedColor,setSelectedColor] = useState<string[]>([]);
  const [selectedSize,setSelectedSize] = useState<string[]>([]);
  const handlePriceChange=(value:number[])=>{
    // console.log(value)
    setPriceFilter({minPrice:value[0], maxPrice:value[1]})
  }
  const handleCategoryFilter=(categorySlug:string)=>{
    let newSelectedCategory = [...selectedCategory];
    if(newSelectedCategory.includes(categorySlug)){
      newSelectedCategory = newSelectedCategory.filter((cat)=>cat !== categorySlug)
    }else{
      newSelectedCategory.push(categorySlug)
    }
    setSelectedCategory(newSelectedCategory);
    newSelectedCategory.length > 0 ? urlSearchParams.set('category',newSelectedCategory.join(',')) : urlSearchParams.delete('category') 
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
  }
  const handleColorFilter=(color:string)=>{
    let newSelectedColor = [...selectedColor];
    if(newSelectedColor.includes(color)){
      newSelectedColor = newSelectedColor.filter((cat)=>cat !== color)
    }else{
      newSelectedColor.push(color)
    }
    setSelectedColor(newSelectedColor);
    newSelectedColor.length > 0 ? urlSearchParams.set('color',newSelectedColor.join(',')) : urlSearchParams.delete('color') 
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
  }
  const handleSizeFilter=(size:string)=>{
    let newSelectedSize = [...selectedSize];
    if(newSelectedSize.includes(size)){
      newSelectedSize = newSelectedSize.filter((cat)=>cat !== size)
    }else{
      newSelectedSize.push(size)
    }
    setSelectedSize(newSelectedSize);
    newSelectedSize.length > 0 ? urlSearchParams.set('size',newSelectedSize.join(',')) : urlSearchParams.delete('size') 
    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
  }
  const handlePriceFilter=()=>{
    urlSearchParams.set('minPrice',String(priceFilter.minPrice));
    urlSearchParams.set('maxPrice',String(priceFilter.maxPrice));
     router.push(`${WEBSITE_SHOP}?${urlSearchParams}`)
  }

  useEffect(()=>{
    searchParams.get('category') ? setSelectedCategory(searchParams.get('category')?.split(',') || []) : setSelectedCategory([]);
    searchParams.get('color') ? setSelectedColor(searchParams.get('color')?.split(',') || []) : setSelectedColor([]);
    searchParams.get('size') ? setSelectedSize(searchParams.get('size')?.split(',') || []) : setSelectedSize([]);
  },[searchParams])
  return (
    <div>
      {
        searchParams.size > 0 && (
          <Button type={"button"} asChild variant='destructive' className="w-full bg-red-500" >
              <Link href={WEBSITE_SHOP} >
                Clear Filter
              </Link>
          </Button>
        )
      }
      <Accordion type="multiple" defaultValue={['1','2','3','4']}>
        <AccordionItem value="1">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">Category</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {
                  categoryData && categoryData.map((category:CategoryData,index:number)=>(
                    <li key={category._id} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox onCheckedChange={()=>handleCategoryFilter(category.slug)} checked={selectedCategory.includes(category.slug)} />
                        <span>{category.name}</span>
                      </label>
                    </li>
                  ))
                }
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">Colors</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {
                  colorsData && colorsData.map((color)=>(
                    <li key={color} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox onCheckedChange={()=>handleColorFilter(color)} checked={selectedColor.includes(color)} />
                        <span>{color}</span>
                      </label>
                    </li>
                  ))
                }
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {
                  sizesData && sizesData.map((size)=>(
                    <li key={size} className="mb-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <Checkbox onCheckedChange={()=>handleSizeFilter(size)} checked={selectedSize.includes(size)} />
                        <span>{size}</span>
                      </label>
                    </li>
                  ))
                }
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="4">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">Prics</AccordionTrigger>
          <AccordionContent>
            <Slider defaultValue={[0,3000]} max={3000} step={1} onValueChange={handlePriceChange} />
            <div className="flex justify-between items-center pt-2">
                <span>{priceFilter.minPrice.toLocaleString('en-IN',{style:'currency',currency:'INR'})}</span>
                <span>{priceFilter.maxPrice.toLocaleString('en-IN',{style:'currency',currency:'INR'})}</span>
            </div>
            <div className="mt-4">
                <ButtonLoading className="rounded-full" type={"button"} text={"Filter Price"} onClick={handlePriceFilter} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterComponent;
