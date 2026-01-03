'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import DataTableWrapper from "@/components/application/Admin/DataTableWrapper";
import DeleteAction from "@/components/application/Admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN, DT_COUPON_COLUMN, DT_CUSTOMERS_COLUMN, DT_ORDER_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_Variant_COLUMN, DT_REVIEW_COLUMN } from "@/lib/columns";
import { columnsConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute";
import { useSearchParams } from "next/navigation";
import { JSX, useCallback, useMemo } from "react";

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_TRASH, label:'Trash' }
];

const TRASH_CONFIG: Record<'category'| 'product' | "product-variant" | 'coupon' | 'customers' | 'review' | 'orders', { title: string, columns: any[], fetchUrl: string, exportUrl: string, deleteUrl: string }> = {
  category: {
    title: 'Category Trash',
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: '/api/category',
    exportUrl: '/api/category/export',
    deleteUrl: '/api/category/delete'
  },
  product: {
    title: 'Product Trash',
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: '/api/product',
    exportUrl: '/api/product/export',
    deleteUrl: '/api/product/delete'
  },
  "product-variant": {
    title: 'Product Variant Trash',
    columns: DT_PRODUCT_Variant_COLUMN,
    fetchUrl: '/api/product-variant',
    exportUrl: '/api/product-variant/export',
    deleteUrl: '/api/product-variant/delete'
  },
  coupon: {
    title: 'Coupon Trash',
    columns: DT_COUPON_COLUMN,
    fetchUrl: '/api/coupon',
    exportUrl: '/api/coupon/export',
    deleteUrl: '/api/coupon/delete'
  },
  customers: {
    title: 'Customers Trash',
    columns: DT_CUSTOMERS_COLUMN,
    fetchUrl: '/api/customers',
    exportUrl: '/api/customers/export',
    deleteUrl: '/api/customers/delete'
  },
  review: {
    title: 'Review Trash',
    columns: DT_REVIEW_COLUMN,
    fetchUrl: '/api/review',
    exportUrl: '/api/review/export',
    deleteUrl: '/api/review/delete'
  },
  orders: {
    title: 'Orders Trash',
    columns: DT_ORDER_COLUMN,
    fetchUrl: '/api/orders',
    exportUrl: '/api/orders/export',
    deleteUrl: '/api/orders/delete'
  },
};

function Trash() {
  const searchParams = useSearchParams();
  // Specify the type of trashOf to be a key of TRASH_CONFIG
  const trashOf= searchParams.get('trashof') as keyof typeof TRASH_CONFIG;

  const config = TRASH_CONFIG[trashOf] || null;

  const columns = useMemo(()=>{
    return columnsConfig(config.columns, false, false, true);
  },[])

  const action = useCallback((
    row: any,
    deleteType: string,
    handleDelete: (ids: string[], type: string) => void
  ): JSX.Element[] => {
    let actionMenu=[]; 
    actionMenu.push(<DeleteAction key='delete' row={row} deleteType={deleteType} handleDelete={handleDelete} />) 
    return actionMenu; 
  },[])

  if (!config) {
    // Handle the case where trashOf is null or undefined (e.g., show an error or default config)
    return <div>Invalid category or trash configuration.</div>;
  }


  return <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">{config.title}</h4>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DataTableWrapper 
            queryKey={`${trashOf}-data-deleted`}
            fetchUrl={config.fetchUrl}
            intialPageSize={10}
            columnsConfig={columns}
            exportEndPoint={config.exportUrl}
            deleteEndPoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />

        </CardContent>
      </Card>
    </div>;
}

export default Trash;
