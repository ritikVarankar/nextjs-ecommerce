'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { FilePath } from "@/lib/ExportFiles";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";

export default function AppSidebar() {
    const { toggleSidebar } = useSidebar();
  return (
    <Sidebar className="z-50">
        <SidebarHeader className="border-b h-14 p-0">
            <div className="flex justify-between items-center">
                <Image className="block dark:hidden h-[50px] w-auto" src={FilePath.logoblack.src} alt="logoblack" width={FilePath.logoblack.width} height={FilePath.logoblack.height} />
                <Image className="hidden dark:block h-[50px] w-auto" src={FilePath.logowhite.src} alt="logowhite" width={FilePath.logowhite.width} height={FilePath.logowhite.height} />
                <Button type="button" size='icon' className="md:hidden" onClick={toggleSidebar}>
                    <IoMdClose />
                </Button>
            </div>
        </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
            {adminAppSidebarMenu.map((menu,index) => (
            <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton asChild className="font-semibold px-2 py-5">
                            <Link href={menu.url}>
                                <menu.icon />
                                {menu.title}

                                {
                                    menu.submenu && menu.submenu.length > 0 && (
                                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    )
                                }
                            </Link>
                        </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {
                        menu.submenu && menu.submenu.length > 0 && (
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {
                                        menu.submenu.map((subMenuItem,subMenuIndex)=>(
                                            <SidebarMenuSubItem key={subMenuIndex}>
                                                <SidebarMenuSubButton asChild className="px-2 py-5">
                                                    <Link href={subMenuItem.url}>
                                                        {subMenuItem.title}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))
                                    }
                                </SidebarMenuSub>
                            </CollapsibleContent>    
                        )
                    }

                </SidebarMenuItem>
            </Collapsible>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}