
import Link from "next/link";
import { IoIosArrowRoundForward } from "react-icons/io";
import axios from "axios";
import { FeaturedProductResponse } from "@/types/webAppDataType/types";
import ProductBox from "./ProductBox";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";

const FeaturedProducts = async() => {
    const { data: getFeaturedProduct } = await axios.get<FeaturedProductResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-featured-product`);
    // console.log('getFeaturedProduct=',getFeaturedProduct)
  if(!getFeaturedProduct) <></>              
  return (
    <section className="lg:px-32 px-4 sm:py-10">
        <div className="flex justify-between items-center mb-5">
            <h2 className="sm:text-4xl text-2xl font-semibold">Featured Products</h2>
            <Link className="flex items-center gap-2 underline underline-offset-4 hover:text-primary" href={WEBSITE_SHOP}>
                View All
                <IoIosArrowRoundForward />        
            </Link>
        </div>
        <div className="grid md:grid-cols-4 grid-cols-2 sm:gap-10 gap-2">
            {
                !getFeaturedProduct.success && (<div className="text-center py-5">Data Not Found</div>)  
            }
            {
                getFeaturedProduct.data.map((dt)=>(
                    <ProductBox key={dt._id} product={dt} />
                ))
            }
           
        </div>
    </section>
  );
};

export default FeaturedProducts;
