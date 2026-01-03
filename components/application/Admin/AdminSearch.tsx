import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SearchModal from "./SearchModal";

const AdminSearch = () => {
    const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="md:w-[350px]">
        <div className="flex items-center justify-between relative">
            <Input className="rounded-full cursor-pointer" placeholder="Search..." onClick={()=>setOpen(true)} readOnly />
            <button type="button" className="absolute right-3 cursor-default"> <IoIosSearch /> </button>
        </div>
        <SearchModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default AdminSearch;
