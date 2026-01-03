'use client';
import UserPanelLayout from "@/components/application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import { ProfileSchemaType, profileSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { UserResponse } from "@/types/webAppDataType/types";
import Dropzone from 'react-dropzone'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FilePath } from "@/lib/ExportFiles";
import { FaCamera } from "react-icons/fa";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";

const breadcrumb = {
  title:'Profile',
  links:[
    {
      label:'Profile'
    }
  ]
}
function Profile() {
  const dispatch = useDispatch()
  const { data:userData } = useFetch<UserResponse>(`/api/profile/get`);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');
  const [file, setFile] = useState<File>();
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone:"",
      address:""
    },
  })

  const handleUpdateProfile=async(values:ProfileSchemaType)=>{
    try{
      setLoading(true);
      let formData = new FormData();
      if(file){
        formData.set('file',file)
      }
      formData.set('name',values.name)
      formData.set('phone',values.phone)
      formData.set('address',values.address)

      const { data:profileResponse } = await axios.put("/api/profile/update",formData);
      if(!profileResponse.success){
        throw new Error(profileResponse.message)
      }
      form.reset();     
      showToast('success',profileResponse.message);
      dispatch(login(profileResponse.data))
    }catch(error){
      if (error instanceof Error) {
        showToast('error', error.message)
      } else {
        showToast('error', 'An unknown error occurred')
      }
    }finally{
      setLoading(false)
    }

  }

  const handleFileSelection=(files:File[])=>{
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setPreview(preview);
    setFile(file);
  }

  useEffect(()=>{
    if(userData){
      form.reset({
        name: userData.name,
        phone: userData.phone,
        address: userData.address,   
      })

      if(userData.avatar && userData.avatar.url){
        setPreview(userData.avatar.url)
      }
    }
  },[userData])


  return (
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      <UserPanelLayout>
        <div className="shadow rounded"> 
          <div className="p-5 text-xl font-semibold border-b">
            Profile
          </div>
          <div className="p-5">
            <Form  {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="grid md:grid-cols-2 grid-cols-1 gap-5">
                <div className="mb-3 md:col-span-2 col-span-1 flex justify-center items-center">
                  <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                    {({getRootProps, getInputProps}) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <Avatar className="w-28 h-28 relative group border border-gray-100">
                            <AvatarImage src={ preview ? preview : FilePath.user.src}  />
                            <div className="absolute z-50 w-full h-full top-1/2 left-1/2
                            -translate-x-1/2 -translate-y-1/2 justify-center items-center border-2 border-violet-500
                            rounded-full group-hover:flex hidden cursor-pointer bg-black/20">
                              <FaCamera color="#7c3aed" />
                            </div>
                          </Avatar>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Enter your phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3 md:col-span-2 col-span-1">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3 md:col-span-2 col-span-1">
                  <ButtonLoading className="cursor-pointer" type="submit" text="Save Changes" loading={loading} />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
}

export default Profile;
