import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import SearchModal from "./SearchModal";

const AdminMobileSearch = () => {
    const [open, setOpen] = useState<boolean>(false);
  return (
    <>
        <Button className="md:hidden" variant='ghost' type="button" size='icon' onClick={()=>setOpen(true)}>
            <IoIosSearch />
        </Button>
        <SearchModal open={open} setOpen={setOpen} />
    </>
  );
};

export default AdminMobileSearch;
