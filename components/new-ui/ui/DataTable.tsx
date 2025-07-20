/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/lib/utils";
import { Eye, Check, X } from "lucide-react";
import Loader from "@/component/helper/Loader";

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
  isLoading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  className,
  maxHeight,
  isLoading,
}: DataTableProps<T>) {
  const renderCell = (column: Column<T>, row: T) => {
    const value = row[column.key];
    return column.render ? column.render(value, row) : value;
  };

  const getStickyStyles = (column: Column<T>, isHeader = false) => {
    if (!column.sticky && !isHeader) return {};

    const hasCustomBg = column.className?.includes("bg-");

    const baseStyles = {
      position: "sticky" as const,
      zIndex: isHeader ? 50 : 10, // Ensure header is above animated body
      backgroundColor: !hasCustomBg
        ? isHeader
          ? "#f9fafb" // match Tailwind's gray-50
          : "#ffffff"
        : undefined,
      // backdropFilter: "blur(4px)",
      paddingTop: "15px",
      paddingBottom: "15px",
    };

    return {
      ...baseStyles,
      [column.sticky || ""]: 0,
    };
  };

  return (
    <div className={cn("w-full rounded-lg bg-white relative", className)}>
      <div className="overflow-y-auto" style={{ maxHeight }}>
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="drop-shadow-lg">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "sticky top-0 z-30 px-4 py-3 text-sm text-center font-extrabold text-gray-500 text-[16px] backdrop-blur-sm",
                    column.sticky === "right" &&
                      "shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)]",
                    column.sticky === "left" &&
                      "shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)]",
                    column.className
                  )}
                  style={{
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
            {isLoading ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex justify-center items-center h-40">
                    <span className="text-muted-foreground text-sm font-medium">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-muted/30 transition-colors z-10"
                  data-aos="fade-up"
                  data-aos-delay={rowIndex * 100}
                  data-aos-duration="500"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn(
                        "px-4 py-3 text-gray-500 font-medium",
                        column.sticky === "right" && "z-20", // add z-20 for sticky right cell
                        column.sticky === "left" && "z-20",
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
    <Eye className="w-4 h-4" />
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
