'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FilePath } from "@/lib/ExportFiles";
import { showToast } from "@/lib/showToast";
import { AddCategorySchemaType, EditMediaSchemaType, addCategorySchema, editMediaSchema } from "@/lib/zodSchema";
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from 'slugify';

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_CATEGORY_SHOW, label:'Category' },
  { href:'', label:'Add Category' }
]
function AddCategory() {
  const [inputs,setInputs] = useState({
    loading:false
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }
  const form = useForm<AddCategorySchemaType>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      slug:""
    },
  })
  const handleAddCategorySubmit=async(values:AddCategorySchemaType)=>{
    try{
      handleInputsOnChange("loading",true)

      const { data:categoryResponse } = await axios.post("/api/category/create",values);
      if(!categoryResponse.success){
      throw new Error(categoryResponse.message)
      }
      form.reset()
      showToast('success',categoryResponse.message)
    }catch(error){
      if (error instanceof Error) {
          showToast('error', error.message)
      } else {
          showToast('error', 'An unknown error occurred')
      }
    }finally{
      handleInputsOnChange("loading",false)
    }
  }

  useEffect(()=>{
    const name = form.getValues('name');
    if(name){
      form.setValue('slug',slugify(name).toLowerCase())
    }
  },[form.watch('name')])
  return (
    <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Category</h4>
        </CardHeader>
        <CardContent className="pb-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddCategorySubmit)} className="space-y-8">
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <ButtonLoading className="cursor-pointer" type="submit" text="Add Category" loading={inputs.loading} />
                </div>
              </form>
            </Form>
        </CardContent>

      </Card>
    </div>
  );
}

export default AddCategory;
