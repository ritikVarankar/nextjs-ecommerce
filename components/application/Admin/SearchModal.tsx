import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Link from "next/link";
import Fuse from 'fuse.js'
import searchData, { SearchDataType } from "./Search";

interface SearchModalProps{
    open:boolean;
    setOpen:(open:boolean)=>void;
}
const options = {
    keys: ['label', 'description', 'keywords'],
    threshold:0.3
}
const SearchModal = ({ open, setOpen }:SearchModalProps) => {
    const [query, setQuery]= useState('')
    const [results, setResults] = useState<SearchDataType[]>([]);
    const fuse = new Fuse(searchData,options);
    useEffect(()=>{
        if(query.trim() === ""){
            setResults([])
        }
        const res = fuse.search(query);
        setResults(res.map((dt)=>dt.item))
    },[query])
  return( 
    <Dialog open={open} onOpenChange={()=>setOpen(!open)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Quick Search</DialogTitle>
                <DialogDescription>
                    Find and navigate to any admin section instantly.
                    Type a keyword to get started.
                </DialogDescription>
            </DialogHeader>

            <Input placeholder="Search..." value={query} onChange={(event)=>setQuery(event.target.value)} autoFocus />
            <ul className="mt-4 max-h-60 overflow-y-auto">
                {
                    results.map((dt:SearchDataType,index)=>(
                         <li key={index}>
                            <Link href={dt.url} className="block py-2 px-3 rounded hover:bg-muted"  onClick={()=>setOpen(false)}>
                                <h4 className="font-medium">{dt.label}</h4>
                                <p className="text-sm text-muted-foreground">{dt.description}</p>
                            </Link>
                        </li>
                    ))
                }
                {
                    results.length === 0 && query && (
                        <div className="text-sm text-center text-muted-foreground mt-4 text-red-500">No Result Found</div>
                    )
                }
               

            </ul>
        </DialogContent>
    </Dialog>
    );
};

export default SearchModal;
