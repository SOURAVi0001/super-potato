import React from 'react';

interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  loading?: boolean;
}

export function Table({
  columns,
  data,
  emptyMessage = 'No records found.',
  loading,
}: TableProps<any>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 text-[12px] font-medium text-stone-600 ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[12px] font-medium text-stone-500">Syncing records...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-stone-400 text-[13px] font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-stone-50 transition-colors duration-100">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3 text-[13px] text-stone-700 ${col.className || ''}`}
                  >
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Table;
