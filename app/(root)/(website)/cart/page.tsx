'use client'
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import { FilePath } from "@/lib/ExportFiles";
import { WEBSITE_CHECKOUT, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { RootState } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiMinus, HiPlus } from "react-icons/hi2";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/store/reducer/cartReducer";

const breadcrumb = {
  title:'Cart',
  links:[
    {
      label:'Cart'
    }
  ]
}
const CartPage = () => {
  const disPatch = useDispatch();
  const cartStore = useSelector((state:RootState)=>state.cartStore);
  const[subtotal,setSubTotal] = useState<number>(0);
  const[discount,setDiscount] = useState<number>(0);

  useEffect(()=>{
      if(cartStore){
        const cartProducts = cartStore.products;
        const totalAmount = cartProducts.reduce((sum,product)=>sum+(product.sellingPrice * product.qty),0)
        const discount = cartProducts.reduce((sum,product)=>sum+((product.mrp - product.sellingPrice)*product.qty),0)
        setSubTotal(totalAmount);
        setDiscount(discount)
      }
    },[cartStore])
  return (
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      {cartStore.count === 0 ? (
        <div className="w-full h-[500px] flex justify-center items-center py-32">
          <div className="text-center">
            <h4 className="text-4xl font-semibold mb-5">Your cart is empty!</h4>
            <Button asChild>
              <Link
                type="button"
                href={WEBSITE_SHOP}
              >
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">
          <div className="lg:w-[70%] w-full">
            <table className="w-full border">
              <thead className="border-b bg-gray-50 md:table-header-group hidden">
                <tr>
                  <th className="text-start p-3">Product</th>
                  <th className="text-center p-3">Price</th>
                  <th className="text-center p-3">Quantity</th>
                  <th className="text-center p-3">Total</th>
                  <th className="text-center p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  cartStore.products.map((product,index)=>(
                    <tr key={index} className="md:table-row block border-b">
                      <td className="p-3">
                        <div className="flex items-center gap-5">
                          <Image src={product.media || FilePath.imgPlaceholder.src} alt={product.name} width={60} height={60} />
                          <div>
                            <h4 className="text-lg font-medium line-clamp-1">
                              <Link href={`${WEBSITE_PRODUCT_DETAILS(product.url)}`}>{product.name}</Link>
                            </h4>
                            <p className="text-sm">Color:{product.color}</p>
                            <p className="text-sm">Size:{product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                        <span className="md:hidden font-medium">Price</span>
                        <span>
                          {product.sellingPrice.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </span>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2">
                        <span className="md:hidden font-medium">Quantity</span>
                         
                        <div className="flex justify-center">
                          <div className="flex justify-center items-center md:h-10 h-7 border w-fit rounded-full">
                            
                            <button
                              type="button"
                              className="h-full w-10 flex justify-center items-center cursor-pointer"
                              onClick={() => disPatch(decreaseQuantity(product))}
                            >
                              <HiMinus />
                            </button>
                            <input
                              className="w-14 text-center border-none outline-offset-0"
                              readOnly
                              type="text"
                              value={product.qty}
                            />
                            <button
                              type="button"
                              className="h-full w-10 flex justify-center items-center cursor-pointer"
                              onClick={() => disPatch(increaseQuantity(product))}
                            >
                              <HiPlus />
                            </button>
                          
                          </div>
                        </div>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                        <span className="md:hidden font-medium">Total</span>
                        <span>
                          <span>
                          {(product.sellingPrice*product.qty).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </span>
                        </span>
                      </td>
                      <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                        <span className="md:hidden font-medium">Remove</span>
                        <button type="button" className="text-red-500"  onClick={() => disPatch(removeFromCart(product))}>
                          <IoIosCloseCircleOutline />
                        </button>
                      </td>
                    </tr>
                  ))
                }
                
              </tbody>
            </table>
          </div>
          <div className="lg:w-[30%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2">Subtotal</td>
                      <td className="text-end py-2">
                        {subtotal.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Discount</td>
                      <td className="text-end py-2">-
                        {discount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Total</td>
                      <td className="text-end py-2">
                        {subtotal.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <Button type="button" asChild className="w-full bg-black rounded-full mt-5 mb-3">
                  <Link href={WEBSITE_CHECKOUT}>Proceed to Checkout</Link>
                </Button>
                <p className="text-center">
                  <Link className="hover:underline" href={WEBSITE_SHOP}>Continue Shopping</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
