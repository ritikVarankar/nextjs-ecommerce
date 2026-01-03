"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"
import { OrdersCountResponse } from "@/types/apidatatype/types"

export const description = "A bar chart"

// const chartData = [
//   { month: "January", amount: 186 },
//   { month: "February", amount: 305 },
//   { month: "March", amount: 237 },
//   { month: "April", amount: 73 },
//   { month: "May", amount: 209 },
//   { month: "June", amount: 214 },
//   { month: "July", amount: 186 },
//   { month: "August", amount: 305 },
//   { month: "September", amount: 237 },
//   { month: "October", amount: 73 },
//   { month: "November", amount: 73 },
//   { month: "December", amount: 209 }
// ]

const chartConfig = {
  amount: {
    label: "amount",
    color: "#8e51ff",
  },
} satisfies ChartConfig

const months=[
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]
interface ChartDataType{
  month: string;
  amount:number
} 
export default function OrderOverView() {
  const [chartData,setChartData] = useState<ChartDataType[]>();
  const { data:monthlySales, loading } = useFetch<OrdersCountResponse[]>('/api/dashboard/admin/monthly-sales');
  useEffect(()=>{
    if(monthlySales){
      const getChartData = months.map((month,index)=>{
        const monthsData = monthlySales.find((item)=>item._id.month === index + 1)
        return{
          month: month,
          amount: monthsData ? monthsData.totalSales : 0
        }
      })
      setChartData(getChartData);
    }
  },[monthlySales])

  return (
    <div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
          </BarChart>
        </ChartContainer>
    </div>
  )
}
