"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FilePath } from "@/lib/ExportFiles";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";


interface EmailVerificationProps{
  params: Promise<{ token: string }>; // adjust the type according to your params structure
};

const EmailVerification=({ params }:EmailVerificationProps)=>{
  const { token } =  use(params);
  const [isVerified,setIsVerified] = useState(false);

  useEffect(()=>{
    const verify=async()=>{
      const { data:verificationResponse } = await axios.post("/api/auth/verify-email", {
        token
      })
      if(verificationResponse.success){
        setIsVerified(true)
      } 
    }
    verify()
  },[])
  
  return(
    <Card className="w-[400px]">
      <CardContent>
        {
          isVerified ? 
          <div>
            <div className="flex justify-cnter items-center">
              <Image className="h-[100px] w-auto" src={FilePath.verified} alt="verified" height={FilePath.verified.height} width={FilePath.verified.width} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-500 my-5">Email Verification Success!</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Go To Home</Link>
                {/* <Link href={WEBSITE_HOME}>Continue Shopping</Link> */}
              </Button>
            </div>
          </div>
          :
          <div>
            <div className="flex justify-cnter items-center">
              <Image className="h-[100px] w-auto" src={FilePath.verificationfailed} alt="verificationfailed"  height={FilePath.verified.height} width={FilePath.verified.width} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500 my-5">Email Verification Failed!</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Go To Home</Link>
              </Button>
            </div>
          </div>
        }
      </CardContent>
    </Card>
  );
}

export default EmailVerification; 
