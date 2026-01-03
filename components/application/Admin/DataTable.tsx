'use client';

import { JSX, useState } from 'react';

import {
    MaterialReactTable,
    MRT_ShowHideColumnsButton,
    MRT_ToggleDensePaddingButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
    type MRT_Row,
} from 'material-react-table';

import {
    IconButton,
    Tooltip,
} from '@mui/material';

import RecyclingIcon from '@mui/icons-material/Recycling';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import Link from 'next/link';
import axios from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { mkConfig, generateCsv, download } from 'export-to-csv';

// import { ApiResponse } from '@/types/apidatatype/types';
import { useDeleteMutation } from '@/hooks/useDeleteMutation';
import { ButtonLoading } from '../ButtonLoading';
import { showToast } from '@/lib/showToast';

// /types/apidatatype/types.ts

export interface ApiResponse<T = any> {
    success: boolean;
    data: T[];
    message?: string;
    meta?: {
        totalRowCount: number;
    };
}


// ---------- PROPS ----------
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


// ---------- COMPONENT ----------
const DataTable = <T extends { _id: string }>({
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

    // ---- TABLE STATE ----
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [exportLoading, setExportLoading] = useState(false);

    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: intialPageSize,
    });

    // ---- DELETE ----
    const deleteMutation = useDeleteMutation(queryKey, deleteEndPoint);

    const handleDelete = (ids: string[], type: string) => {
        const msg =
            type === 'PD'
                ? 'Permanently delete selected items?'
                : type === "RSD" ? 'Restore selected items from trash?' : 'Move selected items to trash?';

        if (!confirm(msg)) return;

        deleteMutation.mutate({ ids, deleteType: type });
        setRowSelection({});
    };

    // ---- EXPORT ----
    const handleExport = async (rows: MRT_Row<T>[]) => {
        setExportLoading(true);

        try {
            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'export-data',
            });

            let csvRows: T[];

            if (rows.length > 0) {
                csvRows = rows.map(r => r.original);
            } else {
                const { data: response } = await axios.get(exportEndPoint);

                if (!response.success) {
                    throw new Error(response.message);
                }

                csvRows = response.data as T[];
            }

            const csv = generateCsv(csvConfig)(csvRows);
            download(csvConfig)(csv);

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Export failed';
            showToast('error', msg);
        } finally {
            setExportLoading(false);
        }
    };

    // ---- FETCH ----
    const queryResult = useQuery<ApiResponse<T>>({
        queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

            url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
            url.searchParams.set('size', `${pagination.pageSize}`);
            url.searchParams.set('filters', JSON.stringify(columnFilters));
            // url.searchParams.set('globalFilter', globalFilter);
            // Fix here: convert undefined or "undefined" string to empty string
            url.searchParams.set('globalFilter', globalFilter && globalFilter !== "undefined" ? globalFilter : "");
    
            url.searchParams.set('sorting', JSON.stringify(sorting));
            url.searchParams.set('deleteType', deleteType);

            const { data: response } = await axios.get<ApiResponse<T>>(url.toString());
            return response;
        },
        placeholderData: keepPreviousData,
    });

    const rows: T[] = queryResult.data?.data ?? [];
    const meta = queryResult.data?.meta;
    const isLoading = queryResult.isLoading;
    const isError = queryResult.isError;
    const isRefetching = queryResult.isRefetching;

    // ---- TABLE INSTANCE ----
    const table = useMaterialReactTable<T>({
        columns: columnsConfig,
        data: rows,

        enableRowSelection: true,
        getRowId: row => row._id,

        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        rowCount: meta?.totalRowCount ?? 0,

        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,

        state: {
            columnFilters,
            globalFilter,
            sorting,
            pagination,
            rowSelection,
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
        },

        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        paginationDisplayMode: 'pages',

        muiToolbarAlertBannerProps: isError
            ? { color: 'error', children: 'Error loading data' }
            : undefined,

        enableRowActions:true,
        positionActionsColumn:'last',
        // ---- ROW ACTIONS ----
        renderRowActionMenuItems: ({ row }) =>
            createAction(row.original, deleteType, handleDelete),

        // ---- TOP TOOLBAR (FIXED NAME!!) ----
        renderToolbarInternalActions: ({ table }) => (
            <>
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />

                {(deleteType !== 'PD' && trashView) && (
                    <Tooltip arrow title="Trash">
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                )}

                {deleteType === 'SD' && (
                    <Tooltip arrow title="Delete Selected">
                        <IconButton
                            disabled={!table.getSelectedRowModel().rows.length}
                            onClick={() => {
                                const ids = table
                                    .getSelectedRowModel()
                                    .rows
                                    .map((r: MRT_Row<T>) => r.id as string);

                                handleDelete(ids, 'SD');
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {deleteType === 'PD' && (
                    <>
                        <Tooltip arrow title="Restore Selected">
                            <IconButton
                                disabled={!table.getSelectedRowModel().rows.length}
                                onClick={() => {
                                    const ids = table
                                        .getSelectedRowModel()
                                        .rows
                                        .map((r: MRT_Row<T>) => r.id as string);

                                    handleDelete(ids, 'RSD');
                                }}
                            >
                                <RestoreFromTrashIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip arrow title="Permanently Delete Selected">
                            <IconButton
                                disabled={!table.getSelectedRowModel().rows.length}
                                onClick={() => {
                                    const ids = table
                                        .getSelectedRowModel()
                                        .rows
                                        .map((r: MRT_Row<T>) => r.id as string);

                                    handleDelete(ids, 'PD');
                                }}
                            >
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </>
        ),

        // ---- EXPORT BUTTON ----
        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip title="Export">
                <ButtonLoading
                    type="button"
                    loading={exportLoading}
                    onClick={() =>
                        handleExport(table.getSelectedRowModel().rows as MRT_Row<T>[])
                    }
                    text={
                        <>
                            <SaveAltIcon fontSize='small' /> Export
                        </>
                    }
                />
            </Tooltip>
        ),
    });

    return <MaterialReactTable table={table} />;
};

export default DataTable;
