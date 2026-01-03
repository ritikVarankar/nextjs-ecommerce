'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import UploadMedia from "@/components/application/Admin/UploadMedia";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { showToast } from "@/lib/showToast";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { MediaDataType } from "@/types/webAppDataType/types";
import Media from "@/components/application/Admin/Media";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { ButtonLoading } from "@/components/application/ButtonLoading";

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:'', label:'Media' }
]

function MediaPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [inputs,setInputs] = useState({
    deleteType:"SD",
    selectedMedia:[],
    selectAll:false
  });
  const handleOnChangeInputs=(input:string, value:string | string[] | boolean)=>{
    setInputs((prev)=>({...prev, [input]:value}))
  }
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['media-data',inputs.deleteType],
    queryFn: async({ pageParam })=> await fetchMedia(pageParam,10,inputs.deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined
    },
  });
  const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')


  const fetchMedia=async(page:number,limit:number,deleteType:string)=>{
    const { data:mediaResponse } = await axios.get(`/api/media?page=${page}&limit=${limit}&deleteType=${deleteType}`);
    return mediaResponse;
  }
  const handleDelete=(ids:string[], deleteType:string)=>{
    let c = true;
    if(deleteType === "PD"){
      c = confirm("Are you sure you want to delete the data permanently?")
    }
    if(c){
      deleteMutation.mutate({ ids, deleteType });
    }
    
    handleOnChangeInputs('selectAll',false)
    handleOnChangeInputs('selectedMedia',[])
  }
  const handleSelectAll=()=>{
    handleOnChangeInputs('selectAll',!inputs.selectAll)
  }

  useEffect(()=>{
    if(inputs.selectAll){
      const ids:string[] = data?.pages.flatMap(page => page.mediaData.map((media:MediaDataType) => media._id)) || [];
      handleOnChangeInputs('selectedMedia',ids)
    }else{
      handleOnChangeInputs('selectedMedia',[])
    }
  },[inputs.selectAll])

  useEffect(()=>{
    if(searchParams){
      const trashOf = searchParams.get('trashof');
      handleOnChangeInputs('selectedMedia',[]);
      if(trashOf){
        handleOnChangeInputs('deleteType','PD');
      }else{
        handleOnChangeInputs('deleteType','SD');
      }
    }
  },[searchParams])
  return <div>
    <BreadcrumbComponent breadCrumbData={breadCrumbData} />
    
    <Card className="py-0 rounded shadow-sm">
      <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xl uppercase">
            {
              inputs.deleteType === 'SD' ? 'MEDIA' : 'MEDIA TRASH'
            }
          </h4>
          <div className="font-semibold text-xl uppercase">
              {
                inputs.deleteType === 'SD' ? 
                (
                <div className="flex items-center gap-2">
                  <UploadMedia isMultiple={true} queryClient={queryClient} />
                  <Button type="button" variant='destructive'>
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>
                      Trash
                    </Link>
                  </Button>
                </div>
                )
                :
                <Button type="button">
                  <Link href={`${ADMIN_MEDIA_SHOW}`}>
                    Back To Media
                  </Link>
                </Button>
              }
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-5">
        {
          inputs.selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center">
              <Label>
                <Checkbox className="border-primary cursor-pointer" checked={inputs.selectAll} onCheckedChange={handleSelectAll} />
                Select All
              </Label>

              <div className="flex gap-2">
                {
                  inputs.deleteType === 'SD' ? (
                    <Button variant='destructive' onClick={()=>handleDelete(inputs.selectedMedia, inputs.deleteType)}>Move Into Trash</Button>
                  ) : (
                    <>
                      <Button className="bg-green-500 hover:bg-green-600" onClick={()=>handleDelete(inputs.selectedMedia, "RSD")}>Restore</Button>
                      <Button variant='destructive' onClick={()=>handleDelete(inputs.selectedMedia, inputs.deleteType)}>Delete Permanently</Button>
                    </>
                  
                  )
                }
                
              </div>
            </div>
          )
        }
        {
          status === 'pending' ? (
            <div>Loading...</div>
          ) : status === 'error' ? (
            <div className="text-red-500 text-sm">Error: {error.message}</div>
          ) : (
            <>
              { data.pages.flatMap(page => page.mediaData.map((media:MediaDataType) => media._id)).length === 0 && (<div className="text-center">Data Not Found.</div>)}
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {
                  data.pages.map((page, index)=>(
                  <React.Fragment key={index}>
                    {
                      page.mediaData.map((media:MediaDataType)=>(
                        <Media key={media._id} media={media} 
                          handleDelete={handleDelete} deleteType={inputs.deleteType}
                          selectedMedia={inputs.selectedMedia} handleOnChangeInputs={handleOnChangeInputs} 
                        />
                      ))
                    }
                  </React.Fragment>
                  ))
                }
              </div>
            </>
          )
        }
        <div className="text-center">
          {
            hasNextPage && (
              <ButtonLoading type="button" loading={isFetching} onClick={() => fetchNextPage()} text="Load More" />
            )
          }
        </div>
      </CardContent>

    </Card>
  </div>;
}

export default MediaPage;
