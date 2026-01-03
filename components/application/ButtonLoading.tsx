import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonLoadingProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    type:"button" | "submit" | "reset";
    text:string | ReactNode;
    loading?:boolean;
    className?:string;
}

export function ButtonLoading({ type = "button",className='cursor-pointer',loading=false,text, ...props}:ButtonLoadingProps) {
  return (
    <Button type={type} className={cn('',className)} disabled={loading} {...props}>
      { loading && (<Spinner />)}
      { text }
    </Button>
  )
}
