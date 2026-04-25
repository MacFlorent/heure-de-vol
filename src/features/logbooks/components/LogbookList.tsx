import { useState, useMemo, useCallback } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { Button, Modal, PageContainer, Table, TableBody, TableData, TableHeader, TableHeaderCell, TableRow } from "@/components/ui";
import { useActiveLogbook } from "@/components/contexts/ActiveLogbookContext";
import { Logbook } from "@/types/logbook";
import { useLogbooks, useDeleteLogbookWithFlights } from "../queries";
import LogbookForm from "./LogbookForm";

const tableColumnHelper = createColumnHelper<Logbook>();

// ============================================================================
// LogbookList
export default function LogbookList() {
    const { data: logbooks, isLoading, isError } = useLogbooks();
    const [tableSort, setTableSort] = useState<SortingState>([]);
    const { activeLogbook, setActiveLogbook } = useActiveLogbook();
    const [editingLogbook, setEditingLogbook] = useState<Logbook | null | undefined>(undefined); // undefined = modal closed | null = create new logbook | Logbook = edit existing logbook
    const isModalOpen = editingLogbook !== undefined;

    const deleteLogbookWithFlights = useDeleteLogbookWithFlights();

    const handleDeleteLogbook = useCallback(async (logbook: Logbook) => {
        if (!logbook?.id) return;
        if (!window.confirm("Deleting this logbook will also delete all associated flight records. Continue?")) return;

        try {
            await deleteLogbookWithFlights.mutateAsync(logbook.id);
        } catch (error) {
            console.error("Failed to delete logbook:", error);
        }
    }, [deleteLogbookWithFlights]);

    const handleActivateLogbook = useCallback((logbook: Logbook) => {
        if (!logbook?.id) return;
        if (logbook.id === activeLogbook?.id) return;
        setActiveLogbook(logbook);
    }, [activeLogbook, setActiveLogbook]);

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
            id: "active",
            header: "Active",
            cell: ({ row }) => (
                <div className="flex space-x-4">
                    {activeLogbook?.id === row.original.id ? (
                        <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                        <Button onClick={() => handleActivateLogbook(row.original)}>
                            Activate
                        </Button>
                    )}
                </div>
            )
        }),

        tableColumnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-4">
                    <Button onClick={() => setEditingLogbook(row.original)}>
                        Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteLogbook(row.original)}>
                        Delete
                    </Button>
                </div>
            ),
        }),
    ], [handleDeleteLogbook, handleActivateLogbook, activeLogbook]);

    const table = useReactTable({
        data: logbooks ?? [],
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setTableSort,
        state: { sorting: tableSort },
    });

    // Component Render
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
