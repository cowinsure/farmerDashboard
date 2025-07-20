/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Eye } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface BasicTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onView?: (row: T) => void;
  emptyMessage?: string;
  maxHeight?: string; // e.g. '400px'
}

export function BasicTable<T extends { id: string | number }>({
  data,
  columns,
  onView,
  emptyMessage = "No data found.",
  maxHeight = "400px",
}: BasicTableProps<T>) {
  return (
    <div className="rounded-lg shadow-md overflow-x-auto animate__animated animate__fadeIn">
      <div className="overflow-y-auto" style={{ maxHeight }}>
        <table className="w-full min-w-[900px] table-fixed">
          <thead className="bg-green-700 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`p-3 text-center sticky top-0 bg-green-700 z-10 ${
                    col.className || ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {onView && (
                <th className="p-3 text-center sticky top-0 right-0 bg-green-700 z-20 min-w-[80px]">
                  View
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row) => (
                <tr key={row.id} className="even:bg-green-50 text-center">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`border border-gray-100 p-2 ${
                        col.className || ""
                      }`}
                    >
                      {col.render ? col.render(row) : (row[col.key] as any)}
                    </td>
                  ))}
                  {onView && (
                    <td className="border border-gray-100 p-2 sticky right-0 bg-white z-10 min-w-[80px]">
                      <button
                        onClick={() => onView(row)}
                        className="text-green-700 hover:text-green-900 hover:bg-green-200 flex items-center justify-center gap-1 w-full"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onView ? 1 : 0)}
                  className="py-4 text-gray-600 bg-green-50 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
