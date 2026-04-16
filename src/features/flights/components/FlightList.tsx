import { useState, useMemo, useCallback } from "react";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { Button, Modal, PageContainer, Table, TableBody, TableData, TableHeader, TableHeaderCell, TableRow } from "@/components/ui";
import { Flight } from "@/types/flight";
import { useFlights, useDeleteFlight } from "../queries";
import FlightForm from "./FlightForm";

const tableColumnHelper = createColumnHelper<Flight>();

// ============================================================================
// FlightList
export default function FlightList() {
    const { data: flights, isLoading, isError } = useFlights();
    const [tableSort, setTableSort] = useState<SortingState>([]);
    
    const [editingFlight, setEditingFlight] = useState<Flight | null | undefined>(undefined); // undefined = modal closed | null = create new flight | Flight = edit existing flight
    const isModalOpen = editingFlight !== undefined;

    const deleteFlight = useDeleteFlight();

    const handleDeleteFlight = useCallback(async (flight: Flight) => {
        if (!flight?.id) return;
        if (!window.confirm("Continue?")) return;

        try {
            await deleteFlight.mutateAsync(flight.id);
        } catch (error) {
            console.error("Failed to delete flight:", error);
        }
    }, [deleteFlight]);

    const tableColumns = useMemo(() => [
        tableColumnHelper.accessor("date", {
            header: "Date",
            cell: (field) => field.getValue(),
        }),
        tableColumnHelper.accessor("aircraftRegistration", {
            header: "Aircraft Registration",
            cell: (field) => field.getValue(),
        }),
        tableColumnHelper.accessor("timeTotal", {
            header: "Total Time",
            cell: (field) => field.getValue(),
        }),
        tableColumnHelper.display({
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-4">
                    <Button onClick={() => setEditingFlight(row.original)}>
                    Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteFlight(row.original)}>
                    Delete
                </Button>
                </div>
            ),
        }),
    ], [handleDeleteFlight]);

    const table = useReactTable({
        data: flights ?? [],
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setTableSort,
        state: { sorting: tableSort },
    });

    // Component Render
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading flights.</div>;

    return (
        <PageContainer>
            {isModalOpen && (
                <Modal onClose={() => setEditingFlight(undefined)}>
                    <FlightForm
                        key={editingFlight?.id ?? "new"}
                        flight={editingFlight ?? null}
                        onClose={() => setEditingFlight(undefined)}
                    />
                </Modal>
            )}

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Flights</h2>
                <Button onClick={() => setEditingFlight(null)}>New Flight</Button>
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
