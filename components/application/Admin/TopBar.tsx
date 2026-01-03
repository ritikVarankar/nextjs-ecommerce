'use client'
import React, { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";
import { FilePath } from "@/lib/ExportFiles";
import Image from "next/image";
import AdminMobileSearch from "./AdminMobileSearch";

function TopBar() {
    const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-08 px-5 flex justify-between items-center bg-white dark:bg-card">
        <div className="flex items-center md:hidden">
            <Image className="block dark:hidden h-[50px] w-auto" src={FilePath.logoblack.src} alt="logoblack" width={FilePath.logoblack.width} height={FilePath.logoblack.height} />
            <Image className="hidden dark:block h-[50px] w-auto" src={FilePath.logowhite.src} alt="logowhite" width={FilePath.logowhite.width} height={FilePath.logowhite.height} /> 
        </div>
        <div className="md:block hidden">
            <AdminSearch />
        </div>
        <div className="flex items-center gap-2">
            <AdminMobileSearch />
            <ThemeSwitch />
            <UserDropdown />
            <Button onClick={toggleSidebar} type="button" size='icon' className="ms-2 md:hidden">
                <RiMenu4Fill />
            </Button>
        </div>
    </div>);
}

export default TopBar;
