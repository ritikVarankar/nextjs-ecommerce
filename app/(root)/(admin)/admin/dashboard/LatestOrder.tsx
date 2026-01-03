'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useFetch from "@/hooks/useFetch";
import { OrderData } from "@/types/webAppDataType/types";
import { FilePath } from "@/lib/ExportFiles";
import Image from 'next/image'
import { statusBadge } from "@/lib/columns";

const LatestOrder = () => {
    const [latestOrder,setLatestOrder] = useState<OrderData[]>([])
  const { data:latestOrderData, loading } = useFetch<OrderData[]>('/api/dashboard/admin/latest-order');
  useEffect(()=>{
    if(latestOrderData){
        setLatestOrder(latestOrderData)
    }
  },[latestOrderData])

  if(loading){
    return (
        <div className="h-full w-full flex justify-center items-center">Loading...</div>
    )
  }

  if(!latestOrderData || latestOrderData.length === 0){
    return(
        <div className="h-full w-full flex justify-center items-center">
            <Image className="w-20" src={FilePath.NotFound.src} alt='NotFound' width={FilePath.NotFound.width} height={FilePath.NotFound.height} />
        </div>
    )
  }


  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order Id</TableHead>
                    <TableHead>Payment Id</TableHead>
                    <TableHead>Total Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    latestOrder.map((order,i)=>(
                        <TableRow key={i}>
                            <TableCell>{order.order_id}</TableCell>
                            <TableCell>{order.payment_id}</TableCell>
                            <TableCell>{order.products.length}</TableCell>
                            <TableCell>{statusBadge(order.orderstatus)}</TableCell>
                            <TableCell>
                                {
                                    order.totalAmount.toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR"
                                    })
                                }
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>

    </div>
  );
};

export default LatestOrder;
