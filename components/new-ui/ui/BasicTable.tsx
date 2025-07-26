import { Eye } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../ui/Accordion";
import "aos/dist/aos.css";
import "animate.css";
import AOS from "aos";
import { useEffect, useState } from "react";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";

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
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isLoading) {
      setShowEmptyMessage(false); // Reset when loading starts
      timeoutId = setTimeout(() => {
        setShowEmptyMessage(true);
      }, 2000); // Wait 2 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg shadow-md overflow-x-auto animate__animated animate__fadeIn">
        <div className="overflow-y-auto" style={{ height: maxHeight }}>
          <table className="w-full min-w-[900px] h-full table-fixed relative">
            <thead className=" text-green-400">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`
                      p-3 text-center font-semibold sticky top-0 z-10 bg-green-950
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
            {isLoading ? (
              <tbody className="h-full ">
                <tr className="h-full">
                  <td
                    colSpan={columns.length + (onView ? 1 : 0)}
                    className="h-full py-8 bg-white text-center align-middle"
                  >
                    <div className="flex justify-center items-center h-full min-h-[300px]">
                      <Helix size="60" speed="2" color="green" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {data.length ? (
                  data.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white text-center text-[#3d3d3d] font-medium animate__animated animate__fadeInUp"
                    >
                      {columns.map((col) => (
                        <td
                          key={String(col.key)}
                          className={`
                border border-gray-100 p-2
                ${col.sticky === "left" ? "sticky left-0 z-20 bg-white" : ""}
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
                    </tr>
                  ))
                ) : showEmptyMessage ? (
                  <tr>
                    <td
                      colSpan={columns.length + (onView ? 1 : 0)}
                      className="py-4 text-gray-600 bg-white text-center"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4 max-h-[600px] overflow-auto py-4 mb-16">
        {isLoading ? (
          <div className="h-full py-8 text-center align-middle">
            <div className="flex justify-center items-center h-full min-h-[300px]">
              <Helix size="60" speed="2" color="green" />
            </div>
          </div>
        ) : data.length ? (
          data.map((row) => {
            // Check if there's a "view" column to use instead of onView
            const viewColumn = columns.find(
              (col) =>
                col.key === "view" && col.sticky === "right" && col.render
            );

            // Other sticky right action buttons (excluding 'view' if already handled)
            const rightActionColumns = columns.filter(
              (col) =>
                col.sticky === "right" && col.render && col.key !== "view"
            );

            return (
              <div
                key={row.id}
                className="grid grid-cols-6 items-center justify-between p-3 rounded-xl shadow-md border bg-white hover:shadow-lg transition-shadow animate__animated animate__fadeIn animate__faster"
              >
                {/* Left: Image + Basic Info */}
                <div className="flex items-center gap-4 col-span-5 min-w-0">
                  {/* Image - fixed size */}
                  <div className="min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] w-14 h-14 rounded-md overflow-hidden flex items-center justify-center text-sm text-gray-600 font-medium flex-shrink-0">
                    {columns[0]?.render ? (
                      columns[0].render(row)
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {(row[columns[0]?.key as keyof T] as string | number) ||
                          ""}
                      </div>
                    )}
                  </div>

                  {/* Text Info - ellipsis */}
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {columns[1]?.render
                        ? columns[1].render(row)
                        : (row[columns[1]?.key as keyof T] as string | number)}
                    </p>
                    <p className="text-xs mt-1 truncate font-medium text-gray-400">
                      {columns[2]?.header}:{" "}
                      {columns[2]?.render
                        ? columns[2].render(row)
                        : (row[columns[2]?.key as keyof T] as string | number)}
                    </p>
                    {(row as { reference_id?: string }).reference_id && (
                      <p className="text-xs mt-1 truncate font-medium text-gray-400">
                        {(row as { reference_id?: string }).reference_id ??
                          "N/A"}
                      </p>
                    )}
                    {(row as { insurance_status?: string })
                      .insurance_status && (
                      <p className="text-xs mt-1 truncate font-medium text-gray-400">
                        Status:{" "}
                        <span className="uppercase">
                          {(row as { insurance_status?: string })
                            .insurance_status ?? "N/A"}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Buttons */}
                <div className="flex flex-col items-end md:items-center gap-2">
                  {/* If a view column exists, render its button */}
                  {viewColumn ? (
                    <div>{viewColumn.render?.(row)}</div>
                  ) : (
                    // Otherwise, fallback to onView button if available
                    onView && (
                      <button
                        onClick={() => onView(row)}
                        className="p-2 bg-green-100 rounded-full hover:bg-muted transition-colors"
                        aria-label="View details"
                      >
                        <Eye className="text-green-600" size={18} />
                      </button>
                    )
                  )}

                  {/* Render any additional action buttons */}
                  {rightActionColumns.map((col) => (
                    <div key={String(col.key)}>{col.render?.(row)}</div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          showEmptyMessage && (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground animate__animated animate__fadeIn">
                {emptyMessage}
              </p>
            </div>
          )
        )}
      </div>
    </>
  );
}

{
  /* Mobile Card View */
}
// <div className="block md:hidden space-y-3 mb-16">
//   {data.length ? (
//     <Accordion type="multiple" className="w-full space-y-3 ">
//       {data.map((row, index) => (
//         <AccordionItem
//           key={row.id}
//           value={item-${index}}
//           data-aos="fade-up"
//           data-aos-delay={${index * 100}}
//           className="bg-white hover:bg-green-50 hover:border-green-500 border"
//         >
//           {/* Header Row */}
//           <div className="flex items-center justify-between p-2">
//             <div className="flex items-start gap-3">
//               <span className="font-semibold w-20 h-20 text-foreground text-sm">
//                 {columns[0]?.render
//                   ? columns[0].render(row)
//                   : (row[columns[0]?.key as keyof T] as string | number)}
//               </span>
//               <span className="font-semibold text-gray-600">
//                 {columns[1]?.header}:{" "}
//                 {columns[1]?.render
//                   ? columns[1].render(row)
//                   : (row[columns[1]?.key as keyof T] as string | number)}
//               </span>
//             </div>

//             <div className="flex items-center gap-2">
//               {onView && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     onView(row);
//                   }}
//                   className="p-2 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-md transition-colors"
//                 >
//                   <Eye size={16} />
//                 </button>
//               )}
//               {/* Move the dropdown icon after View button */}
//               <AccordionTrigger className="p-2">
//                 {/* <ChevronDown className="h-4 w-4 transition-transform duration-200" /> */}
//               </AccordionTrigger>
//             </div>
//           </div>

//           {/* Content */}
//           <AccordionContent>
//             <div className="grid grid-cols-1 gap-3 px-2 animate__animated animate__fadeIn">
//               {columns.slice(2).map((col) => (
//                 <div
//                   key={String(col.key)}
//                   className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
//                 >
//                   <span className="font-medium text-muted-foreground text-sm">
//                     {col.header}
//                   </span>
//                   <span className="text-foreground text-sm font-medium text-right max-w-[60%] break-words">
//                     {col.render
//                       ? col.render(row)
//                       : (row[col.key as keyof T] as string | number)}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </AccordionContent>
//         </AccordionItem>
//       ))}
//     </Accordion>
//   ) : (
//     <div className="text-center py-12 bg-card rounded-lg border">
//       <p className="text-muted-foreground animate__animated animate__fadeIn">
//         {emptyMessage}
//       </p>
//     </div>
//   )}
// </div>
