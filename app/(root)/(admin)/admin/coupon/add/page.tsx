'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddCouponSchemaType, addCouponSchema } from "@/lib/zodSchema";
import { ADMIN_COUPON_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { MediaDataType } from "@/types/webAppDataType/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { showToast } from "@/lib/showToast";
import axios from "axios";


const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_COUPON_SHOW, label:'Coupons' },
  { href:'', label:'Add Coupon' }
]
function AddCoupon() {
  const [inputs,setInputs] = useState({
    loading:false
  });
  const handleInputsOnChange = (text:string, value:boolean|string|MediaDataType[])=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }
  const form = useForm<AddCouponSchemaType>({
    resolver: zodResolver(addCouponSchema),
    defaultValues: {
      code: "",
      discountPercentage:"",
      minShoppingAmount: "",
      validity:""
    }
  });

  const handleAddCouponSubmit=async(values:AddCouponSchemaType)=>{
    try{
      handleInputsOnChange("loading",true);
 
      const obj={
        ...values,
        discountPercentage:String(values.discountPercentage)
      }
      const { data:couponResponse } = await axios.post("/api/coupon/create",obj);
      if(!couponResponse.success){
        throw new Error(couponResponse.message)
      }
      form.reset();     
      showToast('success',couponResponse.message);
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


  return (
    <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddCouponSubmit)} className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div>
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter code" {...field} />
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
                <div>
                  <FormField
                    control={form.control}
                    name="minShoppingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min. Shopping Amount<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="number" min={0} placeholder="Enter Min. Shopping Amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validity<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input type="date" min={0} placeholder="Enter validity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="my-3">
                  <ButtonLoading className="cursor-pointer" type="submit" text="Add Coupon" loading={inputs.loading} />
                </div>
              </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddCoupon;
