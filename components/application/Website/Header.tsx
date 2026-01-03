'use client';
import { FilePath } from "@/lib/ExportFiles";
import { USER_DASHBOARD, WEBSITE_ABOUTUS, WEBSITE_HOME, WEBSITE_LOGIN, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import Cart from "./Cart";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import { HiMiniBars3 } from "react-icons/hi2";
import Search from "./Search";

const Header = () => {
    const { auth, status } = useSelector((state:RootState)=>state.authStore);
    const [isMobileMenu, setIsMobileMenu] = useState<boolean>(false)
    const [showSearch, setShowSearch] = useState<boolean>(false)

  return(
    <div className="bg-white border-b lg:px-32 px-4">
        <div className="flex justify-between items-center lg:py-5 py-3">
            <Link href={WEBSITE_HOME}>
                <Image className="lg:w-32 w-24" src={FilePath.logoblack.src} alt="logoblack" width={383} height={146} />
            </Link>
            <div className="flex justify-between gap-20">
                <nav className={`lg:relative lg:h-auto lg:w-auto lg:top-0 lg:left-0 lg:p-0 bg-white fixed z-50 top-0 w-full h-screen transition-all ${isMobileMenu ? 'left-0' : 'left-full'}`}>
                    
                    <div className="lg:hidden flex justify-between items-center bg-gray-50 py-3 border-b px-3">
                        <Image className="lg:w-32 w-24" src={FilePath.logoblack.src} alt="logoblack" width={383} height={146} />

                        <button type="button" onClick={()=>setIsMobileMenu(false)}>
                            <IoMdClose size={25} className="text-gray-500 hover:text-primary cursor-pointer" />
                        </button>
                    </div>

                    <ul className="lg:flex justify-between items-center gap-10 px-3">
                        <li className="text-gray-600 hover:text-primary hover:font-semibold">
                            <Link href={WEBSITE_HOME} className="block py-2">Home</Link>
                        </li>
                        <li className="text-gray-600 hover:text-primary hover:font-semibold">
                            <Link href={WEBSITE_ABOUTUS} className="block py-2">About</Link>
                        </li>
                        <li className="text-gray-600 hover:text-primary hover:font-semibold">
                            <Link href={WEBSITE_SHOP} className="block py-2">Shop</Link>
                        </li>
                        <li className="text-gray-600 hover:text-primary hover:font-semibold">
                            <Link href={`${WEBSITE_SHOP}?category=t-shirts`} className="block py-2">T-shirts</Link>
                        </li>
                        <li className="text-gray-600 hover:text-primary hover:font-semibold">
                            <Link href={`${WEBSITE_SHOP}?category=hoodies`} className="block py-2">Hoodies</Link>
                        </li>
                        <li className="text-gray-600 hover:text-primary hover:font-semibold">
                            <Link href={`${WEBSITE_SHOP}?category=oversized`} className="block py-2">Oversized</Link>
                        </li>
                    </ul>
                </nav>

                <div className="flex justify-between items-center gap-8">
                    <button type="button" onClick={()=>setShowSearch(!showSearch)}>
                        <IoIosSearch className="text-gray-500 hover:text-primary cursor-pointer" size={25} />
                    </button>
                    <Cart />
                    {
                        !auth ? (
                            <Link href={WEBSITE_LOGIN}>
                                <VscAccount className="text-gray-500 hover:text-primary cursor-pointer" size={25} />
                            </Link>
                        ) : (
                            <Link href={USER_DASHBOARD}>
                                <Avatar>
                                    <AvatarImage src={auth?.avatar?.url || FilePath.user.src} alt="website" />
                                </Avatar>
                            </Link>
                        )
                    }

                    
                    <button type="button" className="lg:hidden block" onClick={()=>setIsMobileMenu(true)}>
                        <HiMiniBars3 size={25} className="text-gray-500 hover:text-primary cursor-pointer" />
                    </button>
                    
                </div>
                 
            </div>
        </div>
        <Search isShow={showSearch} />
    </div>
  );
};

export default Header;
