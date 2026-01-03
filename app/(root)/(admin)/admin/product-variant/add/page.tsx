'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import Editor from "@/components/application/Admin/Editor";
import MediaModal from "@/components/application/Admin/MediaModal";
import Select from "@/components/application/Admin/Select";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { AddProductSchemaType, AddProductVariantSchemaType, addProductSchema, addProductVariantSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_SHOW } from "@/routes/AdminPanelRoute";
import { MediaDataType } from "@/types/webAppDataType/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from 'slugify';
import Image from "next/image";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { sizes } from "@/lib/helperFunction";

interface CategoryOption{
  name:string;
  _id:string
}
const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_PRODUCT_VARIANT_SHOW, label:'Product Variants' },
  { href:'', label:'Add Product Variants' }
]
function AddProduct() {
  const { data:getProduct } = useFetch('/api/product?size=1000&deleteType=SD');
  const [inputs,setInputs] = useState({
    loading:false,
    productOption:[],
    open:false,
    selectedMedia:[],
    isMultiple:true
  });
  const handleInputsOnChange = (text:string, value:boolean|string|MediaDataType[])=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }
  const form = useForm<AddProductVariantSchemaType>({
    resolver: zodResolver(addProductVariantSchema),
    defaultValues: {
      sku:"",
      color:"",
      size:"",
      product: "",
      mrp: "0",
      sellingPrice: "0",
      discountPercentage: "0",
      media:[]
    }
  });

  const handleAddProductVariantSubmit=async(values:AddProductVariantSchemaType)=>{
    try{
      handleInputsOnChange("loading",true);
      if(inputs.selectedMedia.length <= 0){
        return showToast('error', 'Please select media')
      }

      const mediaIds = inputs.selectedMedia.map((media:MediaDataType)=>media._id)
      values.media = mediaIds;
      const obj={
        ...values,
        discountPercentage:String(values.discountPercentage),
        mrp: String(values.mrp),
        sellingPrice:String(values.sellingPrice)
      }
      const { data:productResponse } = await axios.post("/api/product-variant/create",obj);
      if(!productResponse.success){
        throw new Error(productResponse.message)
      }
      form.reset();
      handleInputsOnChange("selectedMedia",[])
      showToast('success',productResponse.message);
    }catch(error){
      if (error instanceof Error) {
        showToast('error', error.message);
      } else {
        showToast('error', 'An unknown error occurred')
      }
    }finally{
      handleInputsOnChange("loading",false)
    }
  }


  useEffect(()=>{
    if(getProduct){
      const options = getProduct.map((product:CategoryOption)=>({label:product.name,value:product._id }))
      handleInputsOnChange('productOption',options)
    }
  },[getProduct])


  // Discount Percentage Calculation
  useEffect(()=>{
    const mrp = form.getValues('mrp') || 0;
    const sellingPrice = form.getValues('sellingPrice') || 0;
    if(Number(mrp) > 0 && Number(sellingPrice) > 0){
      const discountPercentage = ((Number(mrp) - Number(sellingPrice))/Number(mrp)) * 100;
        form.setValue('discountPercentage',String(Math.round(discountPercentage)));
    }
  },[form.watch('mrp'), form.watch('sellingPrice')])

  return (
    <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddProductVariantSubmit)} className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div>
                  <FormField
                    control={form.control}
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select options={inputs.productOption} selected={field.value} setSelected={field.onChange} isMulti={false} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter sku" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter color" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Select options={sizes} selected={field.value} setSelected={field.onChange} isMulti={false} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="Enter mrp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="Enter Selling Price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="discountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="Enter Discount Percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2 border border-dashed rounded p-5 text-center">
                  <MediaModal open={inputs.open} handleInputsOnChange={handleInputsOnChange} 
                  selectedMedia={inputs.selectedMedia} isMultiple={inputs.isMultiple} />

                  {
                    inputs.selectedMedia.length > 0 && (
                      <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                        {
                          inputs.selectedMedia.map((media:MediaDataType)=>(
                            <div key={media._id} className="h-24 w-24 border">
                              <Image src={media.url || ""} alt={media.alt || 'Image'} height={100} width={100} className="object-cover size-full"  />
                            </div>
                          ))
                        }
                      </div>
                    )
                  }

                  <div className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer" onClick={()=>handleInputsOnChange('open',true)}>
                    <span className="font-semibold">Select Media</span>
                  </div>
                </div>
                <div className="my-3">
                  <ButtonLoading className="cursor-pointer" type="submit" text="Add Product Variant" loading={inputs.loading} />
                </div>
              </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProduct;
