
import { OTPSchemaType, otpSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ButtonLoading } from "./ButtonLoading";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useState } from "react";
import { showToast } from "@/lib/showToast";
import axios from "axios";

interface OTPVerificationProps{
  email:string;
  onSubmit:(values:OTPSchemaType)=>void; 
  loading:boolean;
}

function OTPVerification({ email, onSubmit, loading }:OTPVerificationProps) {
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const form = useForm<OTPSchemaType>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email,
      otp:""
    },
  })
  const handleOTPVerification=async(values:OTPSchemaType)=>{
    onSubmit(values)
  }
  const resendOTP=async()=>{
    try{
      setIsResendingOTP(true)

      const { data:resendOtpResponse } = await axios.post("/api/auth/resend-otp",{email});
      if(!resendOtpResponse.success){
        throw new Error(resendOtpResponse.message)
      }
      showToast('success',resendOtpResponse.message)
      } catch (error) {
      if (error instanceof Error) {
          showToast('error', error.message)
      } else {
          showToast('error', 'An unknown error occurred')
      }
    }finally{
      setIsResendingOTP(false)
    }
  }
  
  return (
    <div className="mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOTPVerification)} className="space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Please complete verification</h1>
                <p className="text-md">
                    We have sent an One-time password (OTP) to your registered email address.
                    The OTP is valid for 10 minutes only.
                </p>
            </div>
          <div className="my-5 flex justify-center">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">One-time Password (OTP)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field} >
                        <InputOTPGroup>
                            <InputOTPSlot className="text-xl size-10" index={0} />
                            <InputOTPSlot className="text-xl size-10" index={1} />
                            <InputOTPSlot className="text-xl size-10" index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot className="text-xl size-10" index={3} />
                            <InputOTPSlot className="text-xl size-10" index={4} />
                            <InputOTPSlot className="text-xl size-10" index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-3">
            <ButtonLoading className="w-full cursor-pointer" type="submit" text="Verify" loading={loading} />
            <div className="text-center mt-5">
              {
                !isResendingOTP ? (
                  <button type="button" className="text-blue-500 cursor-pointer hover:underline" onClick={resendOTP}>Resend OTP</button>
                ):(
                  <span className="text-md">Resending...</span>
                )
              }
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default OTPVerification;
