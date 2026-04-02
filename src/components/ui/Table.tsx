// ============================================================================
// Table
export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return <table className={`w-full border-collapse text-sm ${className ?? ""}`} {...props} />;
}

// ============================================================================
// TableHeader
export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <thead className={`bg-gray-50 border-b-2 border-gray-200 ${className ?? ""}`} {...props} />;
}

// ============================================================================
// TableBody
export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody className={`divide-y divide-gray-100 ${className ?? ""}`} {...props} />;
}

// ============================================================================
// TableRow
export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return <tr className={`hover:bg-gray-50 transition-colors ${className ?? ""}`} {...props} />;
}

// ============================================================================
// TableData
export function TableData({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
    return <td className={`px-4 py-3 text-gray-600 ${className ?? ""}`} {...props} />;
}

// ============================================================================
// TableHeaderCell
export function TableHeaderCell({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) {
    return <th className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className ?? ""}`} {...props} />;
}
