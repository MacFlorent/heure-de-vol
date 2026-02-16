//https://blog.logrocket.com/tanstack-table-formerly-react-table/#gettingstartedwithtanstacktable

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
//
import { Logbook } from "@/types/logbook";
import { useLogbooks } from "../queries";

// Create a column helper to ensure type safety
const columnHelper = createColumnHelper<Logbook>();

// Define columns for the table
const columns = [
    columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => info.getValue(),
    }),
];

export default function LogbookList() {
    const { data: logbooks, isLoading, isError } = useLogbooks();

    const table = useReactTable({
        data: logbooks ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading logbooks.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <table>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}