"use client"
import { Card, CardContent } from "@/components/ui/card";
import { FilePath } from "@/lib/ExportFiles";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { forwordPasswordSchema, ForwordPasswordSchemaType, OTPSchemaType } from "@/lib/zodSchema";
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
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/application/OtpVerification";
import UpdatePassword from "@/components/application/UpdatePassword";

function ResetPassword() {
  const [inputs,setInputs] = useState({
    otpEmail:"",
    isOtpVerified:false,
    otpVerificationLoading:false,
    emailVerificationLoading:false
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
    setInputs((prev)=>({...prev,[text]:value}))
  }

  const form = useForm<ForwordPasswordSchemaType>({
    resolver: zodResolver(forwordPasswordSchema),
    defaultValues: {
      email: ""
    },
  })

  const handleEmailVerification=async(values:ForwordPasswordSchemaType)=>{
    try{
      handleInputsOnChange("emailVerificationLoading",true)
      const { data:sendOtpResponse } = await axios.post("/api/auth/reset-password/send-otp",values);
      if(!sendOtpResponse.success){
          throw new Error(sendOtpResponse.message)
      }
      handleInputsOnChange("otpEmail",values.email)
      showToast('success',sendOtpResponse.message)
    } catch (error) {
      if (error instanceof Error) {
          showToast('error', error.message)
      } else {
          showToast('error', 'An unknown error occurred')
      }
    }finally{
        handleInputsOnChange("emailVerificationLoading",false)
    }
  }

    const handleOTPVerification=async(values:OTPSchemaType)=>{
      try{
          handleInputsOnChange("otpVerificationLoading",true)
          const { data:otpResponse } = await axios.post("/api/auth/reset-password/verify-otp",values);
          if(!otpResponse.success){
              throw new Error(otpResponse.message)
          }
          showToast('success',otpResponse.message)
          handleInputsOnChange("isOtpVerified",true)
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
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p>Enter your email for password reset.</p>
              </div>
              <div className="mt-5">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleEmailVerification)} className="space-y-8">
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
                    <div className="mb-3">
                      <ButtonLoading className="w-full cursor-pointer" type="submit" text="Send OTP" loading={inputs.emailVerificationLoading} />
                    </div>
                    <div className="text-center">
                        <div className="flex justify-center items-center">
                            <Link href={WEBSITE_LOGIN} className='text-primary underline'>Back To Login</Link>
                        </div>
                    </div>
                  </form>
                </Form>
              </div>
            </>
          ) : !inputs.isOtpVerified ?  (
            <OTPVerification email={inputs.otpEmail} onSubmit={handleOTPVerification} loading={inputs.otpVerificationLoading} />
          ) : (
            <UpdatePassword email={inputs.otpEmail} />
          )
        }

      </CardContent>
    </Card>
  </div>;
}

export default ResetPassword;
