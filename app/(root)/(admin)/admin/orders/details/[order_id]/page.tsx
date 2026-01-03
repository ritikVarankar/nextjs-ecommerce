'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import Select, { SelectOption } from "@/components/application/Admin/Select";
import { ButtonLoading } from "@/components/application/ButtonLoading";
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { FilePath } from "@/lib/ExportFiles";
import { showToast } from "@/lib/showToast";
import { ADMIN_DASHBOARD, ADMIN_ORDER_SHOW } from "@/routes/AdminPanelRoute";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { OrderData, OrderDetailsResponse } from "@/types/webAppDataType/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

interface OrderDetailsProps {
  params: Promise<{ order_id: string }>; 
}
const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_ORDER_SHOW, label:'Orders' },
  { href:'', label:'Order Details' }
]
const statusOptions = [
  { value:'pending', label:'Pending' },
  { value:'processing', label:'Processing' },
  { value:'shipped', label:'Shipped' },
  { value:'delivered', label:'Delivered' },
  { value:'cancelled', label:'Cancelled' },
  { value:'unverified', label:'Unverified' }
]

const OrderDetails = ({ params }:OrderDetailsProps) => {
  const { order_id } = use(params);
  const { data, loading } = useFetch<OrderData>(`/api/orders/get/${order_id}`);
  const [orderDetailsData,setOrderDetailsData] = useState<OrderData>();
  const [orderStatus,setOrderStatus] = useState<any>('');
  const [updatingStatus,setUpdatingStatus] = useState<boolean>(false);

  const handleOrderStatus=async()=>{
    try {
      setUpdatingStatus(true);
      let obj={
        id:orderDetailsData?._id,
        status: orderStatus
      }
      const { data:orderStatusResponse } = await axios.put("/api/orders/update-status",obj);
      if(!orderStatusResponse.success){
        throw new Error(orderStatusResponse.message)
      }
      showToast('success',orderStatusResponse.message);
    } catch (error) {
      if (error instanceof Error) {
        showToast('error', error.message);
      } else {
        showToast('error', 'An unknown error occurred')
      }
    }finally{
      setUpdatingStatus(false)
    }

  }

  useEffect(()=>{
    if(data){
      setOrderDetailsData(data);
      setOrderStatus(data.orderstatus);
    }
  },[data])
  
  return( 
    <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <div className="border">
        {
          !orderDetailsData ? (
            <div className="flex justify-center items-center py-32">
              <h4 className="text-red-500 text-xl font-semibold">Order Not Found!</h4>
            </div>
          ) : (
            <div>
              <div className="py-2 px-5 border-b mb-3">
                <h4 className="text-lg font-bold text-primary">Order Details</h4>
              </div>
              <div className="px-5">
                <div className="mb-5">
                  <p><b>Order Id:</b>{orderDetailsData.order_id}</p>
                  <p><b>Transaction Id:</b>{orderDetailsData.payment_id}</p>
                  <p className="capitalize"><b>Status:</b>{orderDetailsData.orderstatus}</p>
                </div>
                <table className="w-full border">
                  <thead className="border-b bg-gray-50 dark:bg-card md:table-header-group hidden">
                    <tr>
                      <th className="text-start p-3">Product</th>
                      <th className="text-center p-3">Price</th>
                      <th className="text-center p-3">Quantity</th>
                      <th className="text-center p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orderDetailsData.products.map((product)=>(
                        <tr key={product.variantId._id} className="md:table-row block border-b">
                          <td className="p-3">
                            <div className="flex items-center gap-5">
                              <Image src={ product.variantId.media[0].secure_url || FilePath.imgPlaceholder.src} 
                                height={60} width={60} alt="product" className="rounded"
                              />
                              <div>
                                <h4 className="font-medium">
                                  <Link href={WEBSITE_PRODUCT_DETAILS(product.productId.slug)}>{product.productId.name}</Link>
                                </h4>
                                <p>Color:{product.variantId.color}</p>
                                <p>Size:{product.variantId.size}</p>
                              </div>
                            </div>
                          </td>
                          <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                            <span className="md:hidden font-medium">Price</span>
                            <span>
                              {
                                Number(product.sellingPrice).toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </span>
                          </td>
                          <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                            <span className="md:hidden font-medium">Quantity</span>
                            <span>
                              {product.qty}
                            </span>
                          </td>
                          <td className="md:table-cell flex justify-between md:p-3 px-3 pb-2 text-center">
                            <span className="md:hidden font-medium">Total</span>
                            <span>
                              {
                                (Number(product.qty) * Number(product.sellingPrice)).toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </span>
                          </td>

                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <div className="grid md:grid-cols-2 grid-cols-1 gap-10 border mt-10">
                  <div className="p-5">
                    <h4 className="text-lg font-semibold mb-5">Shipping Address</h4>
                    <div>
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="font-medium py-2">Name</td>
                            <td className="text-end py-2">{orderDetailsData.name}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Email</td>
                            <td className="text-end py-2">{orderDetailsData.email}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Phone</td>
                            <td className="text-end py-2">{orderDetailsData.phone}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Country</td>
                            <td className="text-end py-2">{orderDetailsData.country}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">City</td>
                            <td className="text-end py-2">{orderDetailsData.city}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Pincode</td>
                            <td className="text-end py-2">{orderDetailsData.pincode}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Landmark</td>
                            <td className="text-end py-2">{orderDetailsData.landmark}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Order Note</td>
                            <td className="text-end py-2">{orderDetailsData.ordernote}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 dark:bg-card">
                    <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                    <div>
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="font-medium py-2">Subtotal</td>
                            <td className="text-end py-2">
                              {
                                orderDetailsData.subtotal.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Discount</td>
                            <td className="text-end py-2">
                              {
                                orderDetailsData.discount.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Coupon Discount</td>
                            <td className="text-end py-2">
                              {
                                orderDetailsData.couponDiscount.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Total</td>
                            <td className="text-end py-2">
                              {
                                orderDetailsData.totalAmount.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <hr />
                    <div className="pt-3">
                      <h4 className="text-lg font-semibold mb-5">Order Status</h4>
                      <Select options={statusOptions} 
                      selected={orderStatus} 
                      setSelected={(value)=>setOrderStatus(value)}
                      placeholder="Select" isMulti={false}  />

                      <ButtonLoading className="mt-5" loading={updatingStatus} type={"button"} text={'Save Status'} onClick={handleOrderStatus} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default OrderDetails;
