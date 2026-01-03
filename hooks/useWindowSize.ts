import { useLayoutEffect, useState } from "react"

interface SizeDataType{
    width:number; 
    height:number;
}
const useWindowSize=()=>{
    const [size, setSize] = useState<SizeDataType>({width:0, height:0});
    useLayoutEffect(()=>{
        const handleSize =()=>{
            setSize({
                width:window.innerWidth, 
                height:window.innerHeight
            });
        }
        handleSize();
        window.addEventListener('resize',handleSize);

        return ()=> window.removeEventListener('resize',handleSize);
    },[])

    return size;
}

export default useWindowSize;