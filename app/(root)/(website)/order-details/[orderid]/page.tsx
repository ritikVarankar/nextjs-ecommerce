import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import { FilePath } from "@/lib/ExportFiles";
import { WEBSITE_PRODUCT_DETAILS } from "@/routes/WebsiteRoute";
import { OrderDetailsResponse } from "@/types/webAppDataType/types";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface OrderDetailsProps {
  params: Promise<{ orderid: string }>; 
}
const breadcrumb = {
  title:'Order Details',
  links:[
    {
      label:'Order Details'
    }
  ]
}
const OrderDetails = async({ params }:OrderDetailsProps) => {
  const { orderid } = await params;
  const { data:orderDetailsData } = await axios.get<OrderDetailsResponse>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/get/${orderid}`);
  
  return( 
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      <div className="lg:px-32 px-5 my-20">
        {
          orderDetailsData && !orderDetailsData.success ? (
            <div className="flex justify-center items-center py-32">
              <h4 className="text-red-500 text-xl font-semibold">Order Not Found!</h4>
            </div>
          ) : (
              <div>
                <div className="mb-5">
                  <p><b>Order Id:</b>{orderDetailsData.data.order_id}</p>
                  <p><b>Transaction Id:</b>{orderDetailsData.data.payment_id}</p>
                  <p className="capitalize"><b>Status:</b>{orderDetailsData.data.orderstatus}</p>
                </div>
                <table className="w-full border">
                  <thead className="border-b bg-gray-50 md:table-header-group hidden">
                    <tr>
                      <th className="text-start p-3">Product</th>
                      <th className="text-center p-3">Price</th>
                      <th className="text-center p-3">Quantity</th>
                      <th className="text-center p-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orderDetailsData.data.products.map((product)=>(
                        <tr key={product.variantId._id} className="md:table-row block border-b">
                          <td className="p-3">
                            <div className="flex items-center gap-5">
                              <Image src={ product.variantId.media[0].secure_url || FilePath.imgPlaceholder.src} 
                                height={60} width={60} alt="product" className="rounded"
                              />
                              <div>
                                <h4 className="font-medium line-clamp-1">
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
                            <td className="text-end py-2">{orderDetailsData.data.name}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Email</td>
                            <td className="text-end py-2">{orderDetailsData.data.email}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Phone</td>
                            <td className="text-end py-2">{orderDetailsData.data.phone}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Country</td>
                            <td className="text-end py-2">{orderDetailsData.data.country}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">City</td>
                            <td className="text-end py-2">{orderDetailsData.data.city}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Pincode</td>
                            <td className="text-end py-2">{orderDetailsData.data.pincode}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Landmark</td>
                            <td className="text-end py-2">{orderDetailsData.data.landmark}</td>
                          </tr>
                          <tr>
                            <td className="font-medium py-2">Order Note</td>
                            <td className="text-end py-2">{orderDetailsData.data.ordernote}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50">
                    <h4 className="text-lg font-semibold mb-5">Order Summary</h4>
                    <div>
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="font-medium py-2">Subtotal</td>
                            <td className="text-end py-2">
                              {
                                orderDetailsData.data.subtotal.toLocaleString("en-IN", {
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
                                orderDetailsData.data.discount.toLocaleString("en-IN", {
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
                                orderDetailsData.data.couponDiscount.toLocaleString("en-IN", {
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
                                orderDetailsData.data.totalAmount.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR"
                                })
                              }
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
