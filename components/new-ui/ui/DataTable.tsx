/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import { Eye, Check, X } from "lucide-react";

export interface Column<T> {
  key: keyof T;
  header: string;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
  sticky?: "left" | "right";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  maxHeight?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  maxHeight = "400px",
}: DataTableProps<T>) {
  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key];
    return column.render ? column.render(value, row) : value;
  };

  const getStickyStyles = (column: Column<T>, isHeader = false) => {
    if (!column.sticky) return {};

    const baseStyles = {
      position: "sticky" as const,
      zIndex: isHeader ? 20 : 10,
      backgroundColor: isHeader ? "rgba(250,250,250,0.9)" : "white",
      backdropFilter: "blur(4px)",
    };

    return {
      ...baseStyles,
      [column.sticky]: 0,
    };
  };

  return (
    <div
      className={cn(
        "w-full rounded-lg bg-white",
        className
      )}
    >
      <div className="" style={{ maxHeight }}>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-muted/60 backdrop-blur-sm">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider text-center",
                    "border-r border-border last:border-r-0",
                    column.sticky === "right" &&
                      "shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]",
                    column.sticky === "left" &&
                      "shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)]",
                    column.className
                  )}
                  style={{
                    top: 0,
                    ...getStickyStyles(column, true),
                    minWidth: column.width || "auto",
                    width: column.width || "auto",
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-muted-foreground"
                >
                  Add new asset to see the list here.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-4 py-3 text-sm text-foreground",
                        "border-r border-border last:border-r-0",
                        column.sticky === "right" &&
                          "shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.05)]",
                        column.sticky === "left" &&
                          "shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]",
                        column.className
                      )}
                      style={{
                        ...getStickyStyles(column),
                        minWidth: column.width || "auto",
                        width: column.width || "auto",
                      }}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ✅ Status Indicator Component
export const StatusIndicator = ({ status }: { status: boolean }) => (
  <div className="flex justify-center">
    {status ? (
      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-3 h-3 text-white" />
      </div>
    ) : (
      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
        <X className="w-3 h-3 text-white" />
      </div>
    )}
  </div>
);

// ✅ View Button Component
export const ViewButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="p-1 rounded transition-colors"
    aria-label="View details"
  >
    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
  </button>
);

// ✅ Image Cell Component
export const ImageCell = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
    {src ? (
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-muted"></div>
    )}
  </div>
);
