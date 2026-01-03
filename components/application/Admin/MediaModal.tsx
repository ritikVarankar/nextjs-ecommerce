import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { FilePath } from "@/lib/ExportFiles";
import { MediaDataType } from "@/types/webAppDataType/types";
import ModalMedia from "./ModalMedia";
import { showToast } from "@/lib/showToast";
import { ButtonLoading } from "../ButtonLoading";

interface MediaModalProps{
    open:boolean;
    handleInputsOnChange:(text:string, value:boolean|string| MediaDataType[])=>void;
    // setOpen:(open:boolean)=>void;
    selectedMedia: MediaDataType[];
    // setSelectedMedia:()=>void;
    isMultiple:boolean;
}
function MediaModal({ open, handleInputsOnChange, selectedMedia, isMultiple }:MediaModalProps) {

    const [previouslySelected,setPreviouslySelected] = useState<MediaDataType[]>([]);
    const fetchMedia=async(page:number,limit:number=10,deleteType:string="SD")=>{
        const { data:mediaResponse } = await axios.get(`/api/media?page=${page}&limit=${limit}&deleteType=${deleteType}`);
        return mediaResponse;
    }
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
        isPending,
        isError
    } = useInfiniteQuery({
        queryKey: ['MedialModal'],
        queryFn: async({ pageParam })=> await fetchMedia(pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length;
            return lastPage.hasMore ? nextPage : undefined
        },
    });
    const handleClear=()=>{
        handleInputsOnChange('selectedMedia',[]);
        setPreviouslySelected([])
        handleInputsOnChange('open',false)
    }
    const handleClose=()=>{
        handleInputsOnChange('selectedMedia',previouslySelected);
        handleInputsOnChange('open',false)
    }
    const handleSelect=()=>{
        if(selectedMedia.length <= 0){
            return showToast('error', 'Please select a media');
        }
        setPreviouslySelected(selectedMedia);
        handleInputsOnChange('open',false)
    }
  return (
    <Dialog open={open} onOpenChange={()=>handleInputsOnChange('open',!open)}  >
        <DialogContent onInteractOutside={(e)=>e.preventDefault()}  
        className="sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none" >
            <DialogDescription className="hidden"></DialogDescription>
            <div className="h-[90vh] bg-white dark:bg-card p-3 rounded shadow">
                <DialogHeader>
                    <DialogTitle>Media Selection</DialogTitle>
                </DialogHeader>
                <div className="h-[calc(100%-80px)] overflow-auto py-2">
                    {
                        isPending ? (
                            <div className="size-full flex justify-center items-center">
                                <Image src={FilePath.loading} height={80} width={80} alt="Loading" />
                            </div>
                        ) : isError ? (
                            <div className="size-full flex justify-center items-center">
                                <span className="text-red-500">{error.message}</span>
                            </div>
                        ) : (
                             <>
                                { data.pages.flatMap(page => page.mediaData.map((media:MediaDataType) => media._id)).length === 0 && (<div className="text-center">Data Not Found.</div>)}
                                    <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                                        {
                                            data.pages.map((page, index)=>(
                                            <React.Fragment key={index}>
                                                {
                                                page.mediaData.map((media:MediaDataType)=>(
                                                    <ModalMedia key={media._id} media={media} handleInputsOnChange={handleInputsOnChange} selectedMedia={selectedMedia} isMultiple={isMultiple}                                                    />
                                                ))
                                                }
                                            </React.Fragment>
                                            ))
                                        }
                                    </div>

                                    {
                                        hasNextPage ? 
                                        <div className="flex justify-center py-5">
                                            <ButtonLoading type="button" onClick={() => fetchNextPage()} loading={isFetching} text={"Load More"} />
                                        </div> 
                                        : <p className="text-center py-5">Nothing to more load</p> 
                                    }
                                </>
                        )
                    }
                </div>
                <div className="h-10 pt-3 border-t flex justify-between">
                    <div>
                        <Button type='button' variant='destructive' onClick={handleClear}>
                            Clear All
                        </Button>
                    </div>
                    <div className="flex gap-5">
                        <Button type='button' variant='secondary' onClick={handleClose}>
                            Close
                        </Button>
                        <Button type='button' onClick={handleSelect}>
                            Select
                        </Button>
                    </div>
                </div>

            </div>
        </DialogContent>

    </Dialog>
  );
}

export default MediaModal;
