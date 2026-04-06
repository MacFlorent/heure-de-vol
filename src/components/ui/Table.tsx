import { memo } from "react";

// ============================================================================
// Table
export const Table = memo(({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <table className={`w-full border-collapse text-sm ${className ?? ""}`} {...props} />
));
Table.displayName = "Table";

// ============================================================================
// TableHeader
export const TableHeader = memo(({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`bg-neutral-50 border-b-2 border-neutral-200 ${className ?? ""}`} {...props} />
));
TableHeader.displayName = "TableHeader";

// ============================================================================
// TableBody
export const TableBody = memo(({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`divide-y divide-neutral-100 ${className ?? ""}`} {...props} />
));
TableBody.displayName = "TableBody";

// ============================================================================
// TableRow
export const TableRow = memo(({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`hover:bg-neutral-50 transition-colors ${className ?? ""}`} {...props} />
));
TableRow.displayName = "TableRow";

// ============================================================================
// TableData
export const TableData = memo(({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-4 py-3 text-neutral-600 ${className ?? ""}`} {...props} />
));
TableData.displayName = "TableData";

// ============================================================================
// TableHeaderCell
export const TableHeaderCell = memo(({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider ${className ?? ""}`} {...props} />
));
TableHeaderCell.displayName = "TableHeaderCell";
