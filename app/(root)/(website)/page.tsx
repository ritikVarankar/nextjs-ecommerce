// 'use client'
export const dynamic = "force-dynamic";
import MainSlider from "@/components/application/Website/MainSlider";
import Image from "next/image";
import Link from "next/link";
import { FilePath } from "@/lib/ExportFiles";
import FeaturedProducts from "@/components/application/Website/FeaturedProducts";
import Testimonal from "@/components/application/Website/Testimonal";
import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { TbRosetteDiscountFilled } from "react-icons/tb";

export default function Home() {
  return (
    <>
      <section>
        <MainSlider />
      </section>
      <section className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
        <div className="grid grid-cols-2 sm:gap-10 gap-2">
          <div className="border rounded-lg overflow-hidden">
            <Link href={''} >
              <Image className="transition-all hover:scale-110" src={FilePath.Banner1.src} alt="Banner1" width={FilePath.Banner1.width} height={FilePath.Banner1.height} />
            </Link>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Link href={''} >
              <Image className="transition-all hover:scale-110" src={FilePath.Banner2.src} alt="Banner2" width={FilePath.Banner2.width} height={FilePath.Banner2.height} />
            </Link>
          </div>
        </div>
      </section>
      <FeaturedProducts />

      <section className="sm:pt-20 pt-5 pb-10">
        <Image className='w-full h-full' src={FilePath.Advertisement.src} alt="Advertisement" width={FilePath.Advertisement.width} height={FilePath.Advertisement.height} />
      </section>
      
      <Testimonal />

    <section className="lg:px-32 px-4 border-t py-10">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10">
        <div className="text-center">
          <p className="flex justify-center items-center mb-3">
            <GiReturnArrow size={30} />
          </p>
          <h3 className="text-xl font-semibold">7-Days Returns</h3>
          <p>Risk-free shopping with easy returns.</p>
        </div>
        <div className="text-center">
          <p className="flex justify-center items-center mb-3">
            <FaShippingFast size={30} />
          </p>
          <h3 className="text-xl font-semibold">Free Shipping</h3>
          <p>No extra costs, just the price you see.</p>
        </div>
        <div className="text-center">
          <p className="flex justify-center items-center mb-3">
            <BiSupport size={30} />
          </p>
          <h3 className="text-xl font-semibold">24/7 Support</h3>
          <p>24/7 support, alway here just for you.</p>
        </div>
        <div className="text-center">
          <p className="flex justify-center items-center mb-3">
            <TbRosetteDiscountFilled  size={30} />
          </p>
          <h3 className="text-xl font-semibold">Member Discounts</h3>
          <p>Special offers for our loyal customers.</p>
        </div>
      </div>
    </section>

    </>
  );
}
