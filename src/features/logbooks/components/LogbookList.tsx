import { useState, useMemo } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";

import { Table, TableBody, TableData, TableHeader, TableHeaderCell, TableRow } from "@/components/ui";
import { Logbook } from "@/types/logbook";
import { useLogbooks } from "../queries";
import LogbookForm from "./LogbookForm";

const tableColumnHelper = createColumnHelper<Logbook>();

export default function LogbookList() {
    const { data: logbooks, isLoading, isError } = useLogbooks();
    const [tableSort, setTableSort] = useState<SortingState>([]);
    
    const [editingLogbook, setEditingLogbook] = useState<Logbook | null | undefined>(undefined); // undefined = modal closed | null = create new logbook | Logbook = edit existing logbook
    const isModalOpen = editingLogbook !== undefined;

    const tableColumns = useMemo(() => [
        tableColumnHelper.accessor("name", {
            header: "Name",
            cell: (field) => field.getValue(),
        }),
        tableColumnHelper.accessor("description", {
            header: "Description",
            cell: (field) => field.getValue(),
        }),
        tableColumnHelper.accessor("id", {
            header: "ID",
            cell: (field) => field.getValue(),
        }),
        tableColumnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <button
                    onClick={() => setEditingLogbook(row.original)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                >
                    Edit
                </button>
            ),
        }),
    ], []);

    const table = useReactTable({
        data: logbooks ?? [],
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setTableSort,
        state: { sorting: tableSort },
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading logbooks.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setEditingLogbook(undefined)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <LogbookForm
                            key={editingLogbook?.id ?? "new"}
                            logbook={editingLogbook ?? null}
                            onClose={() => setEditingLogbook(undefined)}
                        />
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Logbooks</h2>
                <button
                    onClick={() => setEditingLogbook(null)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    New Logbook
                </button>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHeaderCell key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {{ asc: " ↑", desc: " ↓" }[header.column.getIsSorted() as string] ?? ""}
                                </TableHeaderCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableData key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableData>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
