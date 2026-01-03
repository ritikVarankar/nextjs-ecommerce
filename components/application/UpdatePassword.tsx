"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updatePasswordSchema, UpdatePasswordSchemaType } from "@/lib/zodSchema";
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
import { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { handleSuccess, handleWarning } from "@/lib/helperFunction";
import { useRouter } from "next/navigation";

interface UpdatePasswordProps{
    email:string
}
function UpdatePassword({ email }:UpdatePasswordProps) {
    const router = useRouter();
  const [inputs,setInputs] = useState({
    loading:false,
    showPassword:true
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }

  const form = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
        email:email,
        password:"",
        confirmPassword:""
    },
  })

  const handlePasswordUpdate=async(values:UpdatePasswordSchemaType)=>{
    try{
     handleInputsOnChange("loading",true)

     const { data:passwordUpdateResponse } = await axios.put("/api/auth/reset-password/update-password",values);
     if(!passwordUpdateResponse.success){
      throw new Error(passwordUpdateResponse.message)
     }
     form.reset()
     handleSuccess(passwordUpdateResponse.message);
     router.push(WEBSITE_LOGIN)
    }catch (error) {
      if (error instanceof Error) {
          handleWarning(error.message)
      } else {
          handleWarning('An unknown error occurred')
      }
    }finally{
     handleInputsOnChange("loading",false)
    }
  }

  return <div>
    <div className="text-center">
      <h1 className="text-3xl font-bold">Update Password</h1>
      <p>Create new password by filling below form.</p>
    </div>
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handlePasswordUpdate)} className="space-y-8">
          <div className="mb-5">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type={"password"} placeholder="******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-5">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div  className="relative">
                    <FormControl>
                        <Input type={inputs.showPassword ? "password" : 'text'} placeholder="******" {...field} />
                    </FormControl>
                    <button type="button" className="absolute top-1/2 transform -translate-y-1/2 right-2" onClick={()=>handleInputsOnChange("showPassword",!inputs.showPassword)}>
                        {
                        inputs.showPassword ?
                        <FaRegEyeSlash />
                        :
                        <FaRegEye />
                        }
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-3">
            <ButtonLoading className="w-full cursor-pointer" type="submit" text="Update Password" loading={inputs.loading} />
          </div>
        </form>
      </Form>
    </div>
  </div>;
}

export default UpdatePassword;
