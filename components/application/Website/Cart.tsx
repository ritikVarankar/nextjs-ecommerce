
'use client'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { RootState } from "@/store/store"
import { BsCart2 } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image";
import { FilePath } from "@/lib/ExportFiles";
import { removeFromCart } from "@/store/reducer/cartReducer"
import Link from "next/link"
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/routes/WebsiteRoute"
import { useEffect, useState } from "react"
import { showToast } from "@/lib/showToast"

export default function Cart() {
  const cartStore = useSelector((state:RootState)=>state.cartStore);
  const disPatch = useDispatch();
  const[isOpen,setIsOpen] = useState<boolean>(false);
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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="relative">
        <BsCart2
          className="text-gray-500 hover:text-primary cursor-pointer"
          size={25}
        />
        <span className="absolute bg-red-500 text-white text-xs rounded-full w-4 h-4 flex justify-center items-center -right-2 -top-1">{cartStore.count}</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="py-2">
          <SheetTitle className="text-2xl">My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100vh-40px)] pb-10 pt-2">
          <div className="h-[calc(100vh-230px)] overflow-auto px-2">
            {cartStore.count === 0 && (
              <div className="h-full flex justify-center items-center text-xl font-semibold">
                Your cart is empty
              </div>
            )}
            {cartStore.products.map((product, index) => (
              <div
                key={product.productId + index}
                className="flex justify-center items-center gap-5 mb-4 border-b pb-4"
              >
                <div className="flex gap-5 items-center">
                  <Image
                    src={product.media || FilePath.imgPlaceholder.src}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-20 h-20 rounded border"
                  />

                  <div>
                    <h4 className="text-lg mb-1">{product.name}</h4>
                    <p className="text-gray-500">
                      {product.size}/{product.color}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="text-red-500 underline underline-offset-1 mb-2 cursor-pointer"
                    onClick={() => disPatch(removeFromCart(product))}
                  >
                    Remove
                  </button>
                  <p className="font-semibold">
                    {product.qty} X{" "}
                    {product.sellingPrice.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="h-32 border-t pt-5 px-7">
            <h2 className="flex justify-between items-center text-lg font-semibold">
              <span>Subtotal</span> 
              <span>{subtotal.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}</span>
            </h2>
            <h2 className="flex justify-between items-center text-lg font-semibold">
              <span>Discount</span> <span>{discount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}</span>
            </h2>
            <div className="flex justify-between mt-3 gap-5">
              <Button asChild variant='ghost' className="w-1/2" onClick={()=>setIsOpen(false)}>
                <Link
                  href={WEBSITE_CART}
                >
                  View Cart
                </Link>
              </Button>
              <Button asChild className="w-1/2" onClick={()=>setIsOpen(false)}>
                {
                  cartStore.count ? (
                    <Link
                      href={WEBSITE_CHECKOUT}
                    >
                      Checkout
                    </Link>
                  ) : (
                    <button type="button" onClick={()=>showToast('error',"Your cart is empty!")}>
                      Checkout
                    </button>
                  )
                }
               </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

