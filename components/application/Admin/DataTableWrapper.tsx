'use client'
import { JSX, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import DataTable from "./DataTable";
import { useTheme } from "next-themes";
import { darkTheme, lightTheme } from "@/lib/materialTheme";
import { MRT_ColumnDef } from "material-react-table";

export interface DataTableProps<T extends { _id: string }> {
  queryKey: string;

  fetchUrl: string;
  exportEndPoint: string;
  deleteEndPoint: string;

  deleteType: 'SD' | 'PD';
  trashView?: string;

  columnsConfig: MRT_ColumnDef<T>[];
  intialPageSize?: number;

  createAction: (
      row: T,
      deleteType: string,
      handleDelete: (ids: string[], type: string) => void
  ) => JSX.Element[];
}

const DataTableWrapper = <T extends { _id: string }>({
    queryKey,
    fetchUrl,
    exportEndPoint,
    deleteEndPoint,
    deleteType,
    trashView,
    columnsConfig,
    intialPageSize = 10,
    createAction,
}: DataTableProps<T>) => {
  
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div>
      <ThemeProvider theme={resolvedTheme === "dark" ? darkTheme : lightTheme}>
        <DataTable
          queryKey={queryKey}
          fetchUrl={fetchUrl}
          columnsConfig={columnsConfig}
          intialPageSize={intialPageSize}
          exportEndPoint={exportEndPoint}
          deleteEndPoint={deleteEndPoint}
          deleteType={deleteType}
          trashView={trashView}
          createAction={createAction}
        />
      </ThemeProvider>
    </div>
  );
};

export default DataTableWrapper;
