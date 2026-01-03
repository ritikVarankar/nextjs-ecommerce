import Chip from '@mui/material/Chip';
import dayjs from 'dayjs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { FilePath } from "@/lib/ExportFiles";
import { OrderStatus } from '@/types/webAppDataType/types';

export const DT_CATEGORY_COLUMN=[
    {
        accessorKey: 'name', 
        header: 'Category Name'
    },
    {
        accessorKey: 'slug', 
        header: 'Slug'
    }
]

export const DT_PRODUCT_COLUMN=[
    {
        accessorKey: 'name', 
        header: 'Product Name'
    },
    {
        accessorKey: 'slug', 
        header: 'Slug'
    },
    {
        accessorKey: 'category', 
        header: 'Category'
    },
    {
        accessorKey: 'mrp', 
        header: 'MRP'
    },
    {
        accessorKey: 'sellingPrice', 
        header: 'Selling Price'
    },
    {
        accessorKey: 'discountPercentage', 
        header: 'Discount Percentage'
    },
    // {
    //     accessorKey: 'media', 
    //     header: 'media'
    // },
    // {
    //     accessorKey: 'description', 
    //     header: 'description'
    // },
    // {
    //     accessorKey: 'deletedAt', 
    //     header: 'deletedAt'
    // }
]

export const DT_PRODUCT_Variant_COLUMN=[
    {
        accessorKey: 'product', 
        header: 'Product Name'
    },
    {
        accessorKey: 'sku', 
        header: 'SKU'
    },
    {
        accessorKey: 'color', 
        header: 'Color'
    },
    {
        accessorKey: 'size', 
        header: 'Size'
    },
    {
        accessorKey: 'mrp', 
        header: 'MRP'
    },
    {
        accessorKey: 'sellingPrice', 
        header: 'Selling Price'
    },
    {
        accessorKey: 'discountPercentage', 
        header: 'Discount Percentage'
    }
]

export const DT_COUPON_COLUMN=[
    {
        accessorKey: 'code', 
        header: 'Code'
    },
    {
        accessorKey: 'discountPercentage', 
        header: 'Discount Percentage'
    },
    {
        accessorKey: 'validity', 
        header: 'Validity',
        Cell: ({ renderedCellValue }:any)=>{
            if(new Date() > new Date(renderedCellValue)){
                return  <Chip label={dayjs(renderedCellValue).format('DD/MM/YYYY')} color="error" /> 
            }else{
                return <Chip label={dayjs(renderedCellValue).format('DD/MM/YYYY')} color="success" /> 
             }
        }
    },
    {
        accessorKey: 'minShoppingAmount', 
        header: 'Min. Shopping Amount'
    }
]

export const DT_CUSTOMERS_COLUMN=[
    {
        accessorKey: 'avatar', 
        header: 'Avatar',
        Cell: ({ renderedCellValue }:any)=>{
            // <Avatar>
            //     <AvatarImage src={renderedCellValue?.url || FilePath.user.src} width={50} height={50} alt="user" />
            //     <AvatarFallback>CN</AvatarFallback>
            // </Avatar>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        }
    },
    {
        accessorKey: 'name', 
        header: 'Name'
    },
    {
        accessorKey: 'email', 
        header: 'Email'
    },
    {
        accessorKey: 'phone', 
        header: 'Phone'
    },
    {
        accessorKey: 'address', 
        header: 'Address'
    },
    {
        accessorKey: 'isEmailVerified', 
        header: 'Is Verified',
        Cell: ({ renderedCellValue }:any)=>{
            if(renderedCellValue){
                return  <Chip label="Verified" color="success" /> 
            }else{
                return <Chip label="Not Verified" color="error" /> 
             }
        }
    }
]

export const DT_REVIEW_COLUMN=[

    {
        accessorKey: 'product', 
        header: 'Product'
    },
    {
        accessorKey: 'user', 
        header: 'User'
    },
    {
        accessorKey: 'title', 
        header: 'Title'
    },
    {
        accessorKey: 'rating', 
        header: 'Rating'
    },
    {
        accessorKey: 'review', 
        header: 'Review'
    }
]

export const DT_ORDER_COLUMN=[

    {
        accessorKey: 'order_id', 
        header: 'Order Id'
    },
    {
        accessorKey: 'payment_id', 
        header: 'Payment Id'
    },
    {
        accessorKey: 'name', 
        header: 'Name'
    },
    {
        accessorKey: 'email', 
        header: 'Email'
    },
    {
        accessorKey: 'phone', 
        header: 'Phone'
    },
    {
        accessorKey: 'country', 
        header: 'Country'
    },
    {
        accessorKey: 'state', 
        header: 'State'
    },
    {
        accessorKey: 'city', 
        header: 'City'
    },
    {
        accessorKey: 'pincode', 
        header: 'Pincode'
    },
    {
        accessorKey: 'landmark', 
        header: 'Landmark'
    },
    // {
    //     accessorKey: 'totalItem', 
    //     header: 'Total Item',
    //     Cell: ({ renderedCellValue, row }:any)=>{
            
    //         // console.log(renderedCellValue,'row?.original',row?.original)
    //         return (
    //             <span>
    //                 {/* { row?.original?.products.length || 0} */}
    //             </span>
    //         )

            
    //     }

    // },
    {
        accessorKey: 'subtotal', 
        header: 'Subtotal'
    },
    {
        accessorKey: 'discount', 
        header: 'Discount'
    },
    {
        accessorKey: 'couponDiscount', 
        header: 'Coupon Discount',
        // Cell: ({ renderedCellValue }:any)=>{
        //     <span>
        //         { Math.round(renderedCellValue) }
        //     </span>
        // }
    },
    {
        accessorKey: 'totalAmount', 
        header: 'Total Amount'
    },
    {
        accessorKey: 'orderstatus', 
        header: 'Status'
    }
]



export const statusBadge = (status: OrderStatus) => {
  const statusColorConfig: Record<OrderStatus, string> = {
    pending: 'bg-blue-500',
    processing: 'bg-yellow-500',
    shipped: 'bg-cyan-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    unverified: 'bg-orange-500',
  }

  return (
    <span
      className={`${statusColorConfig[status]} capitalize px-3 py-1 rounded-full text-xs`}
    >
      {status}
    </span>
  )
}
