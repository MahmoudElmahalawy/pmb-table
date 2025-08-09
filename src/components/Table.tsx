import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import type { TableComponentProps, HeaderConfig } from "../types/table";
import Search from "./table/Search";
import Filters from "./table/Filters";
import Pagination from "./table/Pagination";

const Table: React.FC<TableComponentProps> = ({
  headersConfig,
  data,
  className = "",
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columnHelper = createColumnHelper<any>();

  // Precompute distinct values for status columns to populate selects
  const statusOptionsByKey = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.entries(headersConfig).forEach(([key, config]) => {
      if (config.type === "status") {
        const set = new Set<string>();
        data.forEach((row) => {
          const value = row[key];
          if (value !== undefined && value !== null) set.add(String(value));
        });
        map[key] = Array.from(set).sort();
      }
    });
    return map;
  }, [data, headersConfig]);

  // Helper function to format cell value based on data type
  const formatCellValue = (value: any, config: HeaderConfig): string => {
    switch (config.type) {
      case "date":
        return new Date(value).toLocaleDateString("en-UK", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      case "currency":
        const amount = typeof value === "number" ? value / 100 : value;
        return amount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      case "status":
        return value;
      default:
        return String(value);
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "UNPAID":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCellClass = (config: HeaderConfig): string => {
    const baseClass = "px-4 py-3 text-sm";
    const alignClass =
      config.align === "center"
        ? "text-center"
        : config.align === "right"
          ? "text-right"
          : config.align === "left"
            ? "text-left"
            : "text-center";
    return `${baseClass} ${alignClass}`;
  };

  const columns = useMemo(() => {
    return Object.entries(headersConfig).map(([key, config]) => {
      return columnHelper.accessor(key, {
        id: key,
        header: config.label,
        cell: ({ getValue }) => {
          const value = getValue();
          const formattedValue = formatCellValue(value, config);
          return (
            <div className={getCellClass(config)}>
              {config.type === "status" ? (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                    formattedValue,
                  )}`}
                >
                  {formattedValue}
                </span>
              ) : (
                <span className="text-gray-900">{formattedValue}</span>
              )}
            </div>
          );
        },
        enableSorting: config.sortable !== false,
        enableColumnFilter: config.filterable !== false,
        size: config.width ? parseInt(config.width) : undefined,
        meta: {
          align: config.align || "left",
          width: config.width,
        },
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue) return true;

          if (config.type === "date") {
            const [fromDate, toDate] = filterValue.split("|");
            const cellValue = row.getValue(columnId) as string;
            const cellDate = new Date(cellValue);
            if (fromDate && toDate) {
              const from = new Date(fromDate);
              const to = new Date(toDate);
              return cellDate >= from && cellDate <= to;
            } else if (fromDate) {
              const from = new Date(fromDate);
              return cellDate >= from;
            } else if (toDate) {
              const to = new Date(toDate);
              return cellDate <= to;
            }
            return true;
          }

          if (config.type === "number") {
            const cellValue = row.getValue(columnId) as number;
            const filterNumber = parseFloat(filterValue);
            if (isNaN(filterNumber)) return true;
            return cellValue === filterNumber;
          }

          if (config.type === "status") {
            const cellValue = String(row.getValue(columnId));
            return (
              cellValue.toLowerCase() === String(filterValue).toLowerCase()
            );
          }

          const cellValue = String(row.getValue(columnId)).toLowerCase();
          return cellValue.includes(filterValue.toLowerCase());
        },
      });
    });
  }, [headersConfig, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: (updater) => {
      setSorting(updater as any);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
  });

  const activeFilters = columnFilters.filter((filter) => filter.value);
  const hasFilterableColumns = Object.entries(headersConfig).some(
    ([_, config]) => config.filterable !== false,
  );

  const pageCount = table.getPageCount();
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalFilteredRows = table.getFilteredRowModel().rows.length;
  const pageStart = totalFilteredRows === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min((pageIndex + 1) * pageSize, totalFilteredRows);

  return (
    <div className={`space-y-4 ${className}`}>
      <Search
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        hasFilterableColumns={hasFilterableColumns}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((s) => !s)}
        activeFiltersCount={activeFilters.length}
      />

      {hasFilterableColumns && showFilters && (
        <Filters
          headersConfig={headersConfig}
          getColumnFilterValue={(key) =>
            (table.getColumn(key)?.getFilterValue() as string) ?? ""
          }
          setColumnFilterValue={(key, value) =>
            table.getColumn(key)?.setFilterValue(value)
          }
          isColumnActive={(key) =>
            Boolean((table.getColumn(key)?.getFilterValue() as string) || "")
          }
          statusOptionsByKey={statusOptionsByKey}
        />
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const config = headersConfig[header.id];
                    const isSortable = config?.sortable !== false;
                    return (
                      <th
                        key={header.id}
                        className={`px-4 py-3 text-xs font-medium tracking-wider text-gray-500 ${
                          config?.width ? `w-${config.width}` : ""
                        } ${
                          config?.align === "center"
                            ? "text-center"
                            : config?.align === "right"
                              ? "text-right"
                              : "text-left"
                        }`}
                        style={
                          config?.width ? { width: config.width } : undefined
                        }
                      >
                        <div
                          className={`inline-flex items-center ${
                            isSortable ? "cursor-pointer select-none" : ""
                          }`}
                          onClick={
                            isSortable
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {isSortable && (
                            <div className="ml-2 inline-flex flex-col">
                              <svg
                                className={`h-3 w-3 ${
                                  header.column.getIsSorted() === "asc"
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <svg
                                className={`h-3 w-3 ${
                                  header.column.getIsSorted() === "desc"
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors duration-150 ease-in-out hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {table.getRowModel().rows.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No data available</p>
          </div>
        )}
      </div>

      <Pagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        totalFilteredRows={totalFilteredRows}
        pageStart={pageStart}
        pageEnd={pageEnd}
        onPageSizeChange={(size) => table.setPageSize(size)}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        gotoFirst={() => table.setPageIndex(0)}
        gotoPrev={() => table.previousPage()}
        gotoNext={() => table.nextPage()}
        gotoLast={() => table.setPageIndex(pageCount - 1)}
      />
    </div>
  );
};

export default Table;
