"use client"
import { Card, CardContent } from "@/components/ui/card";
import { FilePath } from "@/lib/ExportFiles";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaType, OTPSchemaType } from "@/lib/zodSchema";
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
import { USER_DASHBOARD, WEBSITE_REGISTER, WEBSITE_RESETPASSWORD } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/application/OtpVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter();
  const dispatch = useDispatch();
  const [inputs,setInputs] = useState({
    loading:false,
    showPassword:true,
    otpEmail:"",
    otpVerificationLoading:false
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password:""
    },
  })

  const handleLoginSubmit=async(values:LoginSchemaType)=>{
    // console.log(values)
    try{
     handleInputsOnChange("loading",true)

     const { data:loginResponse } = await axios.post("/api/auth/login",values);
     if(!loginResponse.success){
      throw new Error(loginResponse.message)
     }
      handleInputsOnChange("otpEmail",values.email)
     form.reset()
     showToast('success',loginResponse.message)
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

  const handleOTPVerification=async(values:OTPSchemaType)=>{
    try{
      handleInputsOnChange("otpVerificationLoading",true)
      const { data:otpResponse } = await axios.post("/api/auth/verify-otp",values);
      if(!otpResponse.success){
        throw new Error(otpResponse.message)
      }
      handleInputsOnChange("otpEmail",'')
      showToast('success',otpResponse.message)
      dispatch(login(otpResponse.data))
      if(searchParams.has('callback')){
        router.push(searchParams.get('callback') || '')
      }else{
        otpResponse.data.role === "admin" ? router.push(ADMIN_DASHBOARD) : router.push(USER_DASHBOARD);
      }
    } catch (error) {
      if (error instanceof Error) {
          showToast('error', error.message)
      } else {
          showToast('error', 'An unknown error occurred')
      }
    }finally{
      handleInputsOnChange("otpVerificationLoading",false)
    }
  }

  return <div>
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <Image className="max-w-[150px]" src={FilePath.logoblack} alt="logoblack" width={FilePath.logoblack.width} height={FilePath.logoblack.height} />
        </div>

        {
          !inputs.otpEmail ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold">Login into account</h1>
                <p>Login into your account by filling out the form below</p>
              </div>
              <div className="mt-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-8">
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
                      <ButtonLoading className="w-full cursor-pointer" type="submit" text="Login" loading={inputs.loading} />
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center items-center gap-1">
                        <p>Don't have an account</p>
                        <Link href={WEBSITE_REGISTER} className='text-primary underline'>Create Account!</Link>
                      </div>
                      <div className="mt-3">
                        <Link href={WEBSITE_RESETPASSWORD} className='text-primary underline'>Forgot Password?</Link>
                      </div>
                    </div>
                  </form>
                </Form>
              </div>
            </>
          ) : (
            <OTPVerification email={inputs.otpEmail} onSubmit={handleOTPVerification} loading={inputs.otpVerificationLoading} />
          )
        }

      </CardContent>
    </Card>
  </div>;
}

export default LoginPage;
