'use client';

import UserPanelLayout from "@/components/application/Website/UserPanelLayout";
import WebsiteBreadcrumb from "@/components/application/Website/WebsiteBreadcrumb";
import useFetch from "@/hooks/useFetch";
import { WEBSITE_ORDER_DETAILS } from "@/routes/WebsiteRoute";
import { RecentOrder } from "@/types/webAppDataType/types";
import Link from "next/link";
import React, { useEffect } from "react";

const breadcrumb = {
  title:'Orders',
  links:[
    {
      label:'Orders'
    }
  ]
}
function Orders() {
  const { data:userOrderData, loading } = useFetch<RecentOrder[]>(`/api/user-order`);

  return (
    <div>
      <WebsiteBreadcrumb breadcrumb={breadcrumb} />
      <UserPanelLayout>
        <div className="shadow rounded"> 
          <div className="p-5 text-xl font-semibold border-b">
            Orders
          </div>
          <div className="p-5">
            <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
            {
              loading ? (
                <div className="text-center py-5">
                  Loading...
                </div>
              ) : (
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
                        userOrderData?.map((order,index)=>(
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
              )
            }
            
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
}

export default Orders;
