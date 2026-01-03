import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/showToast';
import { UploadFileInfo } from '@/types/webAppDataType/types';
import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CldUploadWidget, CloudinaryUploadWidgetError, CloudinaryUploadWidgetInfo, CloudinaryUploadWidgetResults } from 'next-cloudinary';
 import { FaPlus } from "react-icons/fa";

interface UploadMediaProps{
    isMultiple:boolean;
    queryClient:QueryClient 
}
function UploadMedia({ isMultiple,queryClient }:UploadMediaProps) {
    const handleError=(error:CloudinaryUploadWidgetError)=>{
        if(error && typeof error === "object")
          showToast('error',error.statusText);
    }
    const handleQueuesEnd = async(results: CloudinaryUploadWidgetResults) => {
        console.log('handleQueuesEnd=', results);
        
        if (!results.info || typeof results.info === 'string') return; // Check if results.info is not a string

        const info = results.info as CloudinaryUploadWidgetInfo; // Assert that results.info is CloudinaryUploadWidgetInfo
        const files = info.files as UploadFileInfo[]; // Assert that files is an array of UploadFileInfo

        const uploadedFiles = files
            .filter((file) => file.uploadInfo) // Ensure each file has uploadInfo
            .map((file) => ({
                asset_id: file.uploadInfo.asset_id,
                public_id: file.uploadInfo.public_id,
                secure_url: file.uploadInfo.secure_url,
                path: file.uploadInfo.path,
                thumbnail_url: file.uploadInfo.thumbnail_url
            }));
        if(uploadedFiles.length > 0){
            try {
                const { data:mediaLoadResponse } = await axios.post('/api/media/create',uploadedFiles);
                if(!mediaLoadResponse.success){
                    throw new Error(mediaLoadResponse.message)
                }
                queryClient.invalidateQueries(['media-data'] as any)
                showToast('success',mediaLoadResponse.message)
            } catch (error) {
                if (error instanceof Error) {
                    showToast('error', error.message)
                } else {
                    showToast('error', 'An unknown error occurred')
                }
            }
        }
    };

  return (
    <CldUploadWidget 
        signatureEndpoint="/api/cloudinary-signature" 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onError={handleError}
        onQueuesEnd={handleQueuesEnd}
        config={{
            cloud: {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
            }
        }}
        options={{
            sources: ['local', 'url', 'unsplash','google_drive'],
            multiple: isMultiple,
            // maxFiles: 5
        }}
    >
        {({ open }) => {
            return (
            <Button onClick={() => open()}>
                <FaPlus />
                Upload an Image
            </Button>
            );
        }}
    </CldUploadWidget>
  );
}

export default UploadMedia;
