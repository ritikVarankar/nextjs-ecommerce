import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortings } from "@/lib/helperFunction";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";



interface SortingProps{
    limit:number;
    setLimit:(limit:number)=>void;
    sorting:string;
    setSorting:(sorting:string)=>void;
    mobileFilterOpen:boolean;
    setMobileFilterOpen:(mobileFilterOpen:boolean)=>void;
    
}
function Sorting({ limit,setLimit,sorting,setSorting,mobileFilterOpen,setMobileFilterOpen }:SortingProps) {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2 p-4 bg-gray-50">
      
      <Button className="lg:hidden" type='button' onClick={()=>setMobileFilterOpen(!mobileFilterOpen)} >
        <IoFilter />
        Filter
      </Button>
      
      <ul className="flex items-center gap-4">
        <li className="font-semibold">
          Show
        </li>
        {
          [9,12,18,24].map((limitNo)=>(
            <li key={limitNo}>
              <button type="button" onClick={()=>setLimit(limitNo)} className={`${limitNo === limit ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'} w-8 h-8 flex justify-center items-center rounded-full text-sm cursor-pointer`}>{limitNo}</button>
            </li>
          ))
        }
      </ul>

      <Select value={sorting} onValueChange={(value)=>setSorting(value)}>
        <SelectTrigger className="md:w-[180px] w-full bg-white">
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent>
          {
            sortings.map((option)=>(
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>                
            ))
          }
        </SelectContent>
      </Select>

    </div>
  );
}

export default Sorting;
