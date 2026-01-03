'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import DataTableWrapper from "@/components/application/Admin/DataTableWrapper";
import DeleteAction from "@/components/application/Admin/DeleteAction";
import EditAction from "@/components/application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_PRODUCT_COLUMN } from "@/lib/columns";
import { columnsConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT } from "@/routes/AdminPanelRoute";
import Link from "next/link";
import { JSX, useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_PRODUCT_SHOW, label:'Product' }
]
function ShowProduct() {
  const columns = useMemo(()=>{
    return columnsConfig(DT_PRODUCT_COLUMN);
  },[])

  const action = useCallback((
    row: any,
    deleteType: string,
    handleDelete: (ids: string[], type: string) => void
  ): JSX.Element[] => {
    let actionMenu=[]; 
    actionMenu.push(<EditAction key='edit' href={ADMIN_PRODUCT_EDIT(row._id)} />) 
    actionMenu.push(<DeleteAction key='delete' row={row} deleteType={deleteType} handleDelete={handleDelete} />) 
    return actionMenu; 
  },[])


  return <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Show Product</h4>
            <Button>
              <FiPlus fontSize={2} />
              <Link href={ADMIN_PRODUCT_ADD}>
                New  Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DataTableWrapper 
            queryKey="product-data"
            fetchUrl="/api/product"
            intialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/product/export"
            deleteEndPoint="/api/product/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=product`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div>;
}

export default ShowProduct;
