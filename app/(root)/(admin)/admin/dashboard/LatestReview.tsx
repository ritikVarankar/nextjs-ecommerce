'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { FilePath } from "@/lib/ExportFiles";
import { IoStar } from "react-icons/io5";
import useFetch from "@/hooks/useFetch";
import { LatestReviewResponse } from "@/types/apidatatype/types";
import Image from 'next/image'

const LatestReview = () => {
    const [latestReview,setLatestReview] = useState<LatestReviewResponse[]>([])
    const { data:latestReviewResponse, loading } = useFetch<LatestReviewResponse[]>('/api/dashboard/admin/latest-review');
    useEffect(()=>{
        if(latestReviewResponse){
            setLatestReview(latestReviewResponse)
        }
    },[latestReviewResponse])

    if(loading){
        return (
            <div className="h-full w-full flex justify-center items-center">Loading...</div>
        )
    }

    if(!latestReviewResponse || latestReviewResponse.length === 0){
        return(
            <div className="h-full w-full flex justify-center items-center">
                <Image className="w-20" src={FilePath.NotFound.src} alt='NotFound' width={FilePath.NotFound.width} height={FilePath.NotFound.height} />
            </div>
        )
    }
  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    latestReview.map((review,i)=>(
                        <TableRow key={i}>
                            <TableCell className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={ review.product.media[0].secure_url || FilePath.imgPlaceholder.src} alt="@shadcn" />
                                    <AvatarFallback>{review.title}</AvatarFallback>
                                </Avatar>
                                <span className="line-clamp-1">{review.product.name || "Not Found"}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    {
                                        Array.from({length:review.rating}).map((_,index)=>( 
                                            <span key={index}>
                                                <IoStar className="text-yellow-500" />
                                            </span>
                                        ))
                                    }
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>

    </div>
  );
};

export default LatestReview;
