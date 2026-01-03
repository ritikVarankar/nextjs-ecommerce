'use client';
import UserPanelLayout from "@/components/application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import { RootState } from "@/store/store";
import { RecentOrderResponse } from "@/types/webAppDataType/types";
import Link from "next/link";
import React, { useEffect } from "react";
import { HiOutlineAcademicCap, HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCartOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

const breadcrumb = {
  title:'Dashboard',
  links:[
    {
      label:'Dashboard'
    }
  ]
}
function MyAccount() {
  const { data:recentOrderData } = useFetch<RecentOrderResponse>(`/api/dashboard/user`);
  const cartStore = useSelector((state:RootState)=>state.cartStore);
  return (
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      <UserPanelLayout>
        <div className="shadow rounded"> 
          <div className="p-5 text-xl font-semibold border">
            Dashboard
          </div>
          <div className="p-5">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-10">
              <div className="flex items-center justify-between gap-5 border rounded p-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Total Orders</h4>
                  <span className="font-semibold text-gray-500">{recentOrderData?.totalOrders || 0}</span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <HiOutlineShoppingBag size={25} className="text-white" />
                </div>
              </div> 
              <div className="flex items-center justify-between gap-5 border rounded p-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">Items In Cart</h4>
                  <span className="font-semibold text-gray-500">{cartStore.count || 0}</span>
                </div>
                <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                  <IoCartOutline size={25} className="text-white" />
                </div>
              </div> 
            </div>

            <div className="mt-5">
              <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Sr. No.
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Order Id
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Total Item
                      </th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      recentOrderData?.recentOrders.map((order,index)=>(
                        <tr key={order._id}>
                          <td className="text-start text-sm text-gray-500 p-2 font-bold">{index + 1}</td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            <Link className="underline underline-offset-2 hover:text-blue-500" href={WEBSITE_ORDER_DETAILS(order.order_id)}>{order.order_id}</Link>
                          </td>
                          <td className="text-start text-sm text-gray-500 p-2">{order.products.length}</td>
                          <td className="text-start text-sm text-gray-500 p-2">
                            {
                              order.totalAmount.toLocaleString("en-IN", {
                                style: "currency",
                                currency: "INR",
                              })
                            }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>

                </table>
              </div>
            </div>
            
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
}

export default MyAccount;
