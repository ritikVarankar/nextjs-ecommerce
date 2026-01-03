"use client"
import { Card, CardContent } from "@/components/ui/card";
import { FilePath } from "@/lib/ExportFiles";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchemaType } from "@/lib/zodSchema";
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
import Link from "next/link";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { handleSuccess, handleWarning } from "@/lib/helperFunction";

function RegisterPage() {
  const [inputs,setInputs] = useState({
    loading:false,
    showPassword:true
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }

  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        name:"",
        email: "",
        password:"",
        confirmPassword:""
    },
  })

  const handleRegisterSubmit=async(values:RegisterSchemaType)=>{
    // console.log(values)
    try{
     handleInputsOnChange("loading",true)

     const { data:registerResponse } = await axios.post("/api/auth/register",values);
     if(!registerResponse.success){
      throw new Error(registerResponse.message)
     }
     form.reset()
     handleSuccess(registerResponse.message)
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
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image className="max-w-[150px]" src={FilePath.logoblack} alt="logoblack" width={FilePath.logoblack.width} height={FilePath.logoblack.height} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account!</h1>
          <p>Create new account by filling out the form below</p>
        </div>
        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-8">
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Developer Ritik" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                <ButtonLoading className="w-full cursor-pointer" type="submit" text="Register" loading={inputs.loading} />
              </div>
              <div className="text-center">
                <div className="flex justify-center items-center gap-1">
                  <p>Already have an account</p>
                  <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login!</Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  </div>;
}

export default RegisterPage;
