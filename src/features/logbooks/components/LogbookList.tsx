import { useState, useMemo } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";

import { Button, Modal, PageContainer, Table, TableBody, TableData, TableHeader, TableHeaderCell, TableRow } from "@/components/ui";
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
                <Button variant="ghost" className="text-sm" onClick={() => setEditingLogbook(row.original)}>
                    Edit
                </Button>
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
        <PageContainer>
            {isModalOpen && (
                <Modal onClose={() => setEditingLogbook(undefined)}>
                    <LogbookForm
                        key={editingLogbook?.id ?? "new"}
                        logbook={editingLogbook ?? null}
                        onClose={() => setEditingLogbook(undefined)}
                    />
                </Modal>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Logbooks</h2>
                <Button onClick={() => setEditingLogbook(null)}>New Logbook</Button>
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
        </PageContainer>
    );
}
