'use client'
import { BreadcrumbComponent } from "@/components/application/Admin/BreadCrumb";
import DataTableWrapper from "@/components/application/Admin/DataTableWrapper";
import DeleteAction from "@/components/application/Admin/DeleteAction";
import EditAction from "@/components/application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN } from "@/lib/columns";
import { columnsConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_CATEGORY_SHOW, ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_TRASH } from "@/routes/AdminPanelRoute";
import Link from "next/link";
import React, { JSX, useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData=[
  { href:ADMIN_DASHBOARD, label:'Home' },
  { href:ADMIN_CATEGORY_SHOW, label:'Category' }
]
function ShowCategory() {
  const columns = useMemo(()=>{
    return columnsConfig(DT_CATEGORY_COLUMN);
  },[])

  const action = useCallback((
    row: any,
    deleteType: string,
    handleDelete: (ids: string[], type: string) => void
  ): JSX.Element[] => {
    let actionMenu=[]; 
    actionMenu.push(<EditAction key='edit' href={ADMIN_CATEGORY_EDIT(row._id)} />) 
    actionMenu.push(<DeleteAction key='delete' row={row} deleteType={deleteType} handleDelete={handleDelete} />) 
    return actionMenu; 
  },[])


  return <div>
      <BreadcrumbComponent breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm gap-0">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Show Category</h4>
            <Button>
              <FiPlus fontSize={2} />
              <Link href={ADMIN_CATEGORY_ADD}>
                New  Category
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DataTableWrapper 
            queryKey="category-data"
            fetchUrl="/api/category"
            intialPageSize={10}
            columnsConfig={columns}
            exportEndPoint="/api/category/export"
            deleteEndPoint="/api/category/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />

        </CardContent>
      </Card>
    </div>;
}

export default ShowCategory;
