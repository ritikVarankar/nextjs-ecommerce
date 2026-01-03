'use client'
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { showToast } from "@/lib/showToast";
import { AddCategorySchemaType, ApplyCouponSchemaType, PlaceOrderFormSchemaType, addCategorySchema, applyCouponSchema, placeOrderFormSchema } from "@/lib/zodSchema";
import { WEBSITE_ORDER_DETAILS, WEBSITE_PRODUCT_DETAILS, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { addToCart, clearCart } from "@/store/reducer/cartReducer";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaShippingFast } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Loading from "@/components/application/Loading";
import { FilePath } from "@/lib/ExportFiles";
// import Razorpay from 'razorpay';

interface VerifiedCartData {
  productId: string
  variantId: string
  name: string
  url: string
  size: string
  color: string
  mrp: number
  sellingPrice: number
  media: string
  qty: number
}

const breadcrumb = {
  title:'Checkout',
  links:[
    {
      label:'Checkout'
    }
  ]
}
const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartStore = useSelector((state:RootState)=>state.cartStore);
  const { auth, status } = useSelector((state:RootState)=>state.authStore);
  const { data:verifiedCartData } = useFetch('/api/cart-verification','POST',{data:cartStore.products});
  // console.log('verifiedCartData=',verifiedCartData);
  const [verifiedCart,setVerifiedCart] =  useState<VerifiedCartData[]>([])
  const [isCouponApplied,setIsCouponApplied] =  useState<boolean>(false);
  const [couponLoading,setCouponLoading] =  useState<boolean>(false);
  const[subtotal,setSubTotal] = useState<number>(0);
  const[discount,setDiscount] = useState<number>(0);
  const[couponDiscount,setCouponDiscount] = useState<number>(0);
  const[totalAmount,setTotalAmount] = useState<number>(0);
  const[couponCode,setCouponCode] = useState<string>('');
  const [placeOrderLoading,setPlaceOrderLoading] =  useState<boolean>(false);
  const [savingOrder,setSavingOrder] =  useState<boolean>(false);
  
    
  const form = useForm<ApplyCouponSchemaType>({
    resolver: zodResolver(applyCouponSchema),
    defaultValues: {
      code: "",
      minShoppingAmount:String(subtotal)
    },
  })
  const handleApplyCouponSubmit=async(values:ApplyCouponSchemaType)=>{
    try{
      setCouponLoading(true)
      const { data:couponApplyResponse } = await axios.post("/api/coupon/apply",values);
      if(!couponApplyResponse.success){
        throw new Error(couponApplyResponse.message)
      }
      const discountPercentage = couponApplyResponse.data.discountPercentage;
      setCouponDiscount((discountPercentage*subtotal)/100)
      setTotalAmount((subtotal - (discountPercentage*subtotal)/100))
      setCouponCode(values.code);
      setIsCouponApplied(true);
      form.reset()
      showToast('success',couponApplyResponse.message)
    }catch(error){
      if (error instanceof Error) {
        showToast('error', error.message)
      } else {
        showToast('error', 'An unknown error occurred')
      }
    }finally{
      setCouponLoading(false)
    }
  }

  const placeOrderForm = useForm<PlaceOrderFormSchemaType>({
    resolver: zodResolver(placeOrderFormSchema),
    defaultValues: {
      name: "",
      email:"",
      phone: "",
      country:"",
      state: "",
      city:"",
      pincode: "",
      landmark:"",
      ordernote:"",
      userId:auth?._id
    },
  })
  // Get Order ID
  const getOrderID=async(amount:string)=>{
    try {
      const { data:orderIdData } = await axios.post("/api/payment/get-order-id",{amount});
      if(!orderIdData.success){
        throw new Error(orderIdData.message)
      }
      return { success:true, order_id:orderIdData.data }
    } catch (error) {
      if (error instanceof Error) {
        return { success:false, message:error.message }
      } else {
        return { success:false, message:'An unknown error occurred' }
      }
      
    }
  }
  const handlePlaceOrderFormSubmit=async(values:PlaceOrderFormSchemaType)=>{
    try{
      setPlaceOrderLoading(true);
      const generateOrderID = await getOrderID(String(totalAmount));
      if(!generateOrderID.success){
        throw new Error(generateOrderID.message)
      }
      const order_id = generateOrderID.order_id; 
      const razorPayOptions:any = {
        "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        "amount": String(totalAmount*100), // Amount is in currency subunits. 
        "currency": "INR",
        "name": "E-Store",
        "description": "Payment for order",
        "image": "https://res.cloudinary.com/dubhpzpkf/image/upload/v1766911145/logo-black_zx4w1n.webp",
        "order_id": order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": async function (response:any){
          setSavingOrder(true);
          const products = verifiedCart.map((cartItem)=>({
            productId:cartItem.productId,
            variantId:cartItem.variantId,
            name:cartItem.name,
            qty:cartItem.qty,
            mrp:cartItem.mrp,
            sellingPrice:cartItem.sellingPrice
          }))
          const { data:paymentReponseData } = await axios.post('/api/payment/save-order',{
            ...verifiedCartData,
            ...response,
            ...values,
            products:products,
            subtotal,
            discount,
            couponDiscount,
            totalAmount
          })
          if(paymentReponseData.success){
            showToast('success',paymentReponseData.message);
            dispatch(clearCart())
            placeOrderForm.reset();
            router.push(WEBSITE_ORDER_DETAILS(response.razorpay_order_id))
            setSavingOrder(false)
          }else{
            showToast('error',paymentReponseData.message);
            setSavingOrder(false)
          }
        },
        "prefill": {
          "name": values.name,
          "email": values.email,
          "contact": values.phone
        },
        "notes": {
          "address": values.landmark
        },
        "theme": {
          "color": "#7c3aed"
        }
      };
      const rzp1:any = new Razorpay(razorPayOptions);
      rzp1.on('payment.failed', function (response:any){
        showToast('error',response.error.description);
      });
      rzp1.open();

    }catch(error){
      if (error instanceof Error) {
        showToast('error', error.message)
      } else {
        showToast('error', 'An unknown error occurred')
      }
    }finally{
      setPlaceOrderLoading(false)
    }
  }

  const handleRemoveCoupon=()=>{
    setCouponDiscount(0)
    setTotalAmount(subtotal)
    setCouponCode('');
    setIsCouponApplied(false);
  }


  useEffect(()=>{
    if(verifiedCartData){
      setVerifiedCart(verifiedCartData);
      dispatch(clearCart())

      verifiedCartData.forEach((element:VerifiedCartData) => {
        dispatch(addToCart(element))
      });
    }
  },[verifiedCartData])
  useEffect(()=>{
    if(cartStore){
      const cartProducts = cartStore.products;
      const subTotalAmount = cartProducts.reduce((sum,product)=>sum+(product.sellingPrice * product.qty),0)
      const discount = cartProducts.reduce((sum,product)=>sum+((product.mrp - product.sellingPrice)*product.qty),0)
      setSubTotal(subTotalAmount);
      setDiscount(discount)
      setTotalAmount(subTotalAmount)
      if (subTotalAmount > 0) {
        form.setValue('minShoppingAmount',String(subTotalAmount))
      }
    }
  },[cartStore])

  useEffect(()=>{
    if(auth && auth?._id){
      placeOrderForm.setValue('userId',auth?._id)
    }
  },[auth])

  // useEffect(() => {
  //   console.log("errors", form.formState.errors);
  // }, [form.formState.errors]);
  // useEffect(()=>{
  //     const minShoppingAmount = form.getValues('minShoppingAmount');
  //     console.log("minShoppingAmount=",minShoppingAmount)
  //   },[form.watch('minShoppingAmount')])

 
  return (
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      {
        savingOrder && (
        <div className="h-screen w-screen fixed top-0 left-0 z-50 bg-black/50">
          <div className="h-screen flex justify-center items-center">
            <Image src={FilePath.loading} height={80} width={80} alt="Loading" />
            <h4 className="font-semibold">Order Confirming...</h4>
          </div>
        </div>
      )}
      { cartStore.count === 0 ? (
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
      ) :(
        <div className="flex lg:flex-nowrap flex-wrap gap-10 my-20 lg:px-32 px-4">
          <div className="lg:w-[60%] w-full">
            <div className="flex font-semibold gap-2 items-center">
              <FaShippingFast size={25} />
              Shipping Address:
            </div>
            <div className="mt-5">
              <Form {...placeOrderForm}>
                <form onSubmit={placeOrderForm.handleSubmit(handlePlaceOrderFormSubmit)} className="grid grid-cols-2 gap-5">
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="email" placeholder="Enter email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="pincode"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter pincode" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3">
                    <FormField
                      control={placeOrderForm.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="text" placeholder="Enter landmark" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-3 col-span-2">
                    <FormField
                      control={placeOrderForm.control}
                      name="ordernote"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Enter ordernote" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <div className="mb-3">
                      <ButtonLoading className="cursor-pointer bg-black hover:bg-black rounded-full px-5" type="submit" text="Place Order" loading={placeOrderLoading} />
                    </div>
                </form>
              </Form>
              
            </div>
          </div>
          <div className="lg:w-[40%] w-full">
            <div className="rounded bg-gray-50 p-5 sticky top-5">
              <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
              <div>

                <table className="w-full border">
                  <tbody>
                    {
                      verifiedCart.map((product,index)=>(
                        <tr key={index}>
                          <td className="p-3">
                            <Image src={product.media} width={60} height={60} alt={product.name} className="rounded" />
                            <div>
                              <h4 className="font-medium line-clamp-1">
                                <Link href={WEBSITE_PRODUCT_DETAILS(product.url)}>{product.name}</Link>
                              </h4>
                              <p>Color:{product.color}</p>
                              <p>Size:{product.size}</p>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <p className="text-nowrap text-sm">
                              {product.qty} * {product.sellingPrice.toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })}

                            </p>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="font-medium py-2">Subtotal</td>
                      <td className="text-end py-2">
                        {
                          subtotal.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })
                        }
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Discount</td>
                      <td className="text-end py-2">- 
                        {
                          discount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })
                        }
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2">Coupon Discount</td>
                      <td className="text-end py-2">- 
                        {
                          couponDiscount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })
                        }
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-2 text-xl">Total</td>
                      <td className="text-end py-2">
                        {
                          totalAmount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-2 mb-5">
                  {
                    !isCouponApplied ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleApplyCouponSubmit)} className="flex justify-between gap-5">
                          <div className="w-[calc(100%-100px)]">
                            <FormField
                              control={form.control}
                              name="code"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input type="text" placeholder="Enter coupon code" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-[100px]">
                            <ButtonLoading className="cursor-pointer w-full text-xs" type="submit" text="Apply Coupon" loading={couponLoading} />
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="flex justify-between py-1 px-5 rounded-lg bg-gray-200">
                        <div>
                          <span className="text-xs">Coupon:</span>
                          <p className="text-sm font-semibold">{couponCode}</p>
                        </div>
                        <button type='button' className="text-red-500 cursor-pointer" onClick={handleRemoveCoupon}>
                          <IoCloseCircleSharp />
                        </button>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
  );
};

export default Checkout;
