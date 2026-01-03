'use client'

import { use, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { FilePath } from "@/lib/ExportFiles";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditMediaSchemaType, LoginSchemaType, editMediaSchema, loginSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ApiResponse } from "@/types/apidatatype/types";
import { MediaDataType } from "@/types/webAppDataType/types";
import axios from "axios";
import { showToast } from "@/lib/showToast";

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_MEDIA_SHOW, label:'Media' },
  { href:'', label:'Media' }
]

function EditMedia({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: mediaResponse } = useFetch<MediaDataType>(`/api/media/get/${id}`);
  const [inputs,setInputs] = useState({
    loading:false
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }
  const form = useForm<EditMediaSchemaType>({
    resolver: zodResolver(editMediaSchema),
    defaultValues: {
      _id: "",
      alt:"",
      title:''
    },
  })
  const handleUploadMediaSubmit=async(values:EditMediaSchemaType)=>{
    console.log(values)
    try{
     handleInputsOnChange("loading",true)

     const { data:mediaUpdateResponse } = await axios.put("/api/media/update",values);
     if(!mediaUpdateResponse.success){
      throw new Error(mediaUpdateResponse.message)
     }
     form.reset()
     showToast('success',mediaUpdateResponse.message)
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
    if(mediaResponse){
      form.reset({
        _id: mediaResponse._id,
        alt: mediaResponse.alt,
        title: mediaResponse.title
      })
    }
  },[mediaResponse])

  if(!mediaResponse) return <></>

  return (
    <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Media</h4>
        </CardHeader>
        <CardContent className="pb-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUploadMediaSubmit)} className="space-y-8">
                <div className="mb-5">
                  <Image src={mediaResponse.secure_url || FilePath.imgPlaceholder} width={150} height={150} alt={mediaResponse.alt || 'Image'} />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="alt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alt</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter alt" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <ButtonLoading className="cursor-pointer" type="submit" text="Upload Media" loading={inputs.loading} />
                </div>
              </form>
            </Form>
        </CardContent>

      </Card>
    </div>
  );
}

export default EditMedia;
