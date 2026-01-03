'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { FilePath } from "@/lib/ExportFiles";
import { showToast } from "@/lib/showToast";
import { UpdateCategorySchemaType, EditMediaSchemaType, addCategorySchema, editMediaSchema, updateCategorySchema } from "@/lib/zodSchema";
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import slugify from 'slugify';

interface EditCategoryProps {
  params: Promise<{ id: string }>; // Assuming params contains the 'id' field as a string
}

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_CATEGORY_SHOW, label:'Category' },
  { href:'', label:'Edit Category' }
]
function EditCategory({ params }: EditCategoryProps) {
  const { id } = use(params);
  const { data:categoryData } = useFetch(`/api/category/get/${id}`);

  const [inputs,setInputs] = useState({
    loading:false
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }
  const form = useForm<UpdateCategorySchemaType>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      _id:id,
      name: "",
      slug:""
    },
  })
  const handleUpdateCategorySubmit=async(values:UpdateCategorySchemaType)=>{
    try{
      handleInputsOnChange("loading",true)

      const { data:categoryResponse } = await axios.put("/api/category/update",values);
      if(!categoryResponse.success){
      throw new Error(categoryResponse.message)
      }
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
    if(categoryData){
      const data = categoryData;
      form.reset({
        _id:data._id,
        name:data.name,
        slug:data.slug
      })
    }
  },[categoryData])

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
          <h4 className="text-xl font-semibold">Edit Category</h4>
        </CardHeader>
        <CardContent className="pb-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateCategorySubmit)} className="space-y-8">
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
                  <ButtonLoading className="cursor-pointer" type="submit" text="Update Category" loading={inputs.loading} />
                </div>
              </form>
            </Form>
        </CardContent>

      </Card>
    </div>
  );
}

export default EditCategory;
