import { Eye } from "lucide-react";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  sticky?: "left" | "right";
}

interface BasicTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onView?: (row: T) => void; // optional for backward compatibility
  emptyMessage?: string;
  maxHeight?: string;
  isLoading?: boolean;
}

export function BasicTable<T extends { id: string | number }>({
  data,
  columns,
  onView,
  emptyMessage = "No data found.",
  maxHeight = "auto",
  isLoading,
}: BasicTableProps<T>) {
  return (
    <div className="rounded-lg shadow-md overflow-x-auto animate__animated animate__fadeIn">
      <div className="overflow-y-auto" style={{ height: maxHeight }}>
        <table className="w-full min-w-[900px] table-fixed">
          <thead className=" text-gray-700">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`
                    p-3 text-center font-semibold sticky top-0 z-10 bg-gray-200
                    ${col.sticky === "left" ? "sticky left-0 z-20" : ""}
                    ${
                      col.sticky === "right"
                        ? "sticky right-0 z-20 bg-green-200"
                        : ""
                    }
                    ${col.className || ""}
                  `}
                >
                  {col.header}
                </th>
              ))}
              {onView && (
                <th className="p-3 text-center sticky top-0 right-0 bg-green-200 text-gray-700 z-20">
                  View
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white text-center text-[#3d3d3d] font-medium"
                  data-aos="fade-up"
                >
                  {isLoading ? (
                    <td
                      colSpan={columns.length + (onView ? 1 : 0)}
                      className="p-4"
                    >
                      Loading...
                    </td>
                  ) : (
                    <>
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={`
                            border border-gray-100 p-2
                            ${
                              col.sticky === "left"
                                ? "sticky left-0 z-20 bg-white"
                                : ""
                            }
                            ${
                              col.sticky === "right"
                                ? "sticky right-0 z-20 bg-green-50"
                                : ""
                            }
                            ${col.className || ""}
                          `}
                        >
                          {col.render
                            ? col.render(row)
                            : (row[col.key as keyof T] as string | number)}
                        </td>
                      ))}
                      {onView && (
                        <td className="border border-gray-100 p-2 sticky right-0 bg-green-50 z-10 min-w-[80px]">
                          <button
                            onClick={() => onView(row)}
                            className="text-green-600 hover:text-green-900 flex items-center justify-center gap-1 cursor-pointer py-2 w-[70%] mx-auto rounded-lg"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onView ? 1 : 0)}
                  className="py-4 text-gray-600 bg-white text-center"
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
