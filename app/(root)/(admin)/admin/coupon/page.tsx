'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import DataTableWrapper from "@/components/application/Admin/DataTableWrapper";
import DeleteAction from "@/components/application/Admin/DeleteAction";
import EditAction from "@/components/application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_COUPON_COLUMN } from "@/lib/columns";
import { columnsConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_COUPON_SHOW, ADMIN_COUPON_EDIT, ADMIN_COUPON_ADD } from "@/routes/AdminPanelRoute";
import Link from "next/link";
import { JSX, useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_COUPON_SHOW, label:'Coupon' }
]
function ShowCoupon() {
  const columns = useMemo(()=>{
    return columnsConfig(DT_COUPON_COLUMN);
  },[])

  const action = useCallback((
    row: any,
    deleteType: string,
    handleDelete: (ids: string[], type: string) => void
  ): JSX.Element[] => {
    let actionMenu=[]; 
    actionMenu.push(<EditAction key='edit' href={ADMIN_COUPON_EDIT(row._id)} />) 
    actionMenu.push(<DeleteAction key='delete' row={row} deleteType={deleteType} handleDelete={handleDelete} />) 
    return actionMenu; 
  },[])


  return <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Show Coupon</h4>
            <Button>
              <FiPlus fontSize={2} />
              <Link href={ADMIN_COUPON_ADD}>
                New  Coupon
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DataTableWrapper 
            queryKey="coupon-data"
            fetchUrl="/api/coupon"
            intialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/coupon/export"
            deleteEndPoint="/api/coupon/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=coupon`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div>;
}

export default ShowCoupon;
