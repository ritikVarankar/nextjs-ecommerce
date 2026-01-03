'use client'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

function ThemeSwitch() {
    const { setTheme } = useTheme();
  return(
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className="cursor-pointer" type="button" variant='ghost'>
                <IoSunnyOutline className="dark:hidden" />
                <IoMoonOutline className="hidden dark:block" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuItem onClick={()=>setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setTheme('dark')}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>setTheme('system')}>System</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSwitch;

