'use client'
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Review } from "@/types/webAppDataType/types";
import { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "../ButtonLoading";
import { AddReviewSchemaType, addReviewSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Rating } from "@mui/material";
import { Textarea } from "@/components/ui/textarea"
import axios from "axios";
import { showToast } from "@/lib/showToast";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import ReviewList from "./ReviewList";
import useFetch from "@/hooks/useFetch";

interface ReviewCount {
  reviews: { _id: number; count: number }[];
  totalReview: number;
  averageRating: string;
  rating: Record<number, number>;
  percentage: Record<number, number>;
}

interface ProductReviewProps{
    productId:string;
}
const ProductReview = ({productId}:ProductReviewProps) => {
  const queryClient= useQueryClient();
  const { data:reviewDetails } = useFetch(`/api/review/details?productId=${productId}`);
  const { auth } = useSelector((state:RootState)=>state.authStore);
  const [inputs,setInputs] = useState<{
    loading: boolean;
    currentUrl: string;
    isReview: boolean;
    reviewCount: ReviewCount | null;
  }>({
      loading:false,
      currentUrl:'',
      isReview:false,
      reviewCount:null
  });
  const handleInputsOnChange = (text:string, value:boolean|string)=>{
      setInputs((prev)=>({...prev,[text]:value}))
  }
  const form = useForm<AddReviewSchemaType>({
      resolver: zodResolver(addReviewSchema),
      defaultValues: {
          product:productId,
          userId:auth?._id,
          rating:"0",
          title:"",
          review:""
      },
  })
  const handleReviewSubmit=async(values:AddReviewSchemaType)=>{
    try{
      handleInputsOnChange("loading",true)
      const { data:reviewResponse } = await axios.post("/api/review/create",values);
      if(!reviewResponse.success){
        throw new Error(reviewResponse.message)
      }
      form.reset()
      showToast('success',reviewResponse.message);
      queryClient.invalidateQueries(['product-review'] as any)
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
  const fetchReviews = async(pageParams:number)=>{
    const { data:getReviewData } = await axios.get(`/api/review/get?productId=${productId}&page=${pageParams}`);
    if(!getReviewData.success){
      return
    }
    return getReviewData.data;
  }
  useEffect(()=>{
    if(typeof window !== 'undefined'){
      handleInputsOnChange("currentUrl",window.location.href)
    }
  },[])
  useEffect(()=>{
    if(auth){
      form.setValue('userId',auth._id)
    }
  },[auth])

  const {
    error, data, isFetching, fetchNextPage, hasNextPage 
  } = useInfiniteQuery({
    queryKey:['product-review'],
    queryFn: async({ pageParam })=> await fetchReviews(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage:any) => lastPage.nextPage ?? undefined,
  });

  useEffect(()=>{
    if(reviewDetails){
      handleInputsOnChange("reviewCount",reviewDetails);
    }
  },[reviewDetails])
  return (
    <div className="shadow rounded border mb-20">
      <div className="p-3 bg-gray-50 border-b">
        <h2 className="font-semibold text-2xl">Rating & Reviews</h2>
      </div>
      <div className="p-5">
        <div className="flex justify-between flex-wrap items-center">
          <div className="md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5">
            <div className="md:w-[200px] w-full md:mb-0 mb-5">
              <h4 className="text-center text-8xl font-semibold">{inputs.reviewCount?.averageRating}</h4>
              <div className="flex justify-center gap-2">
                  {
                      Array.from({length:5}).map((_,index)=>( 
                          <span key={index}>
                              <IoStar className="text-yellow-500" />
                          </span>
                      ))
                  }
              </div>
              <p className="text-center mt-3">({inputs.reviewCount?.totalReview} Rating & Reviews)</p>
            </div>
            <div className="md:w-[calc(100%-200px)] flex items-center">
              <div className="w-full">
                  {
                      [5,4,3,2,1].map((dt)=>(
                          <div key={dt} className="flex items-center gap-2 mb-2">
                              <div className="flex items-center gap-1">
                                  <p className="w-3">{dt}</p>
                                  <IoStar />
                              </div>
                              <Progress value={inputs.reviewCount?.percentage[dt]} />
                              <span className="text-sm">{inputs.reviewCount?.rating[dt]}</span>
                          </div>
                      ))
                  }
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full md:text-end text-center">
            <Button
              className="md:w-fit w-full py-6 px-10"
              variant='outline'
              type="button"
              onClick={()=>handleInputsOnChange('isReview',!inputs.isReview)}
            >
              Write Review
            </Button>
          </div>
      </div>

      {
        inputs.isReview && (
          <div className="my-5">
            <hr className="mb-5" />
            <h4 className="text-xl font-semibold mb-3">Write Review</h4>
            {
              !auth ? (
                <>
                  <p className="mb-2">Login to submit review.</p>
                  <Button
                    type="button"
                    asChild
                  >
                    <Link href={`${WEBSITE_LOGIN}?callback=${inputs.currentUrl}`}>Login</Link>
                  </Button>
                </>
              ) : (
                <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleReviewSubmit)} className="space-y-8">
                      <div className="mb-5">
                      <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Rating</FormLabel>
                              <FormControl>
                                <Rating {...field} value={Number(field.value)} size="large"  />
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
                              <Input type="text" placeholder="Review title" {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      </div>
                      <div className="mb-5">
                      <FormField
                          control={form.control}
                          name="review"
                          render={({ field }) => (
                          <FormItem>
                              <FormLabel>Review</FormLabel>
                              <FormControl>
                              <Textarea placeholder="write your comment here..." {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                          )}
                      />
                      </div>
                      <div className="mb-3">
                      <ButtonLoading className="cursor-pointer" type="submit" text="Submit Review" loading={inputs.loading} />
                      </div>
                  </form>
                </Form>
                </>
              )
            }
              
          </div>
        )
      }

      <div className="mt-10 border-t pt-5">
          <h5 className="text-xl font-semibold">{data?.pages[0]?.totalReview || 0} Reviews</h5>
          <div className="mt-10">
            {
              data && data?.pages.map((page)=>(
                page.reviews.map((review:Review)=>(
                  <div key={review._id}  className="mb-5">
                    <ReviewList review={review} />
                  </div>
                ))
              ))
            }
            {
              hasNextPage && (
                <ButtonLoading type={"button"} text={"Load More"} loading={isFetching}   onClick={(e) => {
                  e.preventDefault();
                  fetchNextPage();
                }} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
