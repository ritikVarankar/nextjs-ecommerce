import Image from "next/image";
import { MediaDataType } from "@/types/webAppDataType/types";
import { Checkbox } from "@/components/ui/checkbox";

interface ModalMediaProps{
    media:MediaDataType;
    handleInputsOnChange:(text:string, value:boolean|string| MediaDataType[])=>void;
    selectedMedia: MediaDataType[];
    isMultiple:boolean;
}
function ModalMedia({ media, handleInputsOnChange, selectedMedia, isMultiple }:ModalMediaProps) {
    const handleCheck=()=>{
        let newSelectedMedia:MediaDataType[]=[];
        const isSelected = selectedMedia.find((m:MediaDataType)=> media._id === m._id) ? true : false;

        if(isMultiple){
            // select multiple media
            if(isSelected){
                // remove selected media from array
                newSelectedMedia = selectedMedia.filter((m:MediaDataType)=> media._id !== m._id)
            }else{
                // add new media into array
                newSelectedMedia=[...selectedMedia, {
                    ...media,
                    _id:media._id,
                    url: media.secure_url
                }]
            }
            handleInputsOnChange('selectedMedia',newSelectedMedia)  
        }else{
            // select single media
            handleInputsOnChange('selectedMedia',[{ ...media,_id:media._id, url: media.secure_url }]) 
        }
    }
  return (
    <label htmlFor={media._id} className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
        <div className="absolute top-2 left-2 z-20">
            <Checkbox className="border-primary cursor-pointer" checked={ selectedMedia.find((m:MediaDataType)=> media._id === m._id) ? true : false} onCheckedChange={handleCheck} />
        </div>
        <div className="size-full relative">
            <Image src={media.secure_url} alt={media.alt || 'Image'} height={300} width={300} className="object-cover w-full sm:h-[200px] h-[150px]"  />
        </div>
    </label>
  );
}

export default ModalMedia;
