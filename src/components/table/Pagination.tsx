import React from "react";

interface PaginationProps {
  pageIndex: number;
  pageCount: number;
  pageSize: number;
  totalFilteredRows: number;
  pageStart: number;
  pageEnd: number;
  onPageSizeChange: (size: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  gotoFirst: () => void;
  gotoPrev: () => void;
  gotoNext: () => void;
  gotoLast: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageCount,
  pageSize,
  totalFilteredRows,
  pageStart,
  pageEnd,
  onPageSizeChange,
  canPreviousPage,
  canNextPage,
  gotoFirst,
  gotoPrev,
  gotoNext,
  gotoLast,
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <span className="text-sm text-gray-500">
        {totalFilteredRows === 0 ? "0" : `${pageStart}-${pageEnd}`} of{" "}
        {totalFilteredRows} rows
      </span>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <button
            className="rounded border border-gray-300 px-2 py-1 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={gotoFirst}
            disabled={!canPreviousPage}
          >
            « First
          </button>
          <button
            className="rounded border border-gray-300 px-2 py-1 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={gotoPrev}
            disabled={!canPreviousPage}
          >
            ‹ Prev
          </button>
          <span className="px-2">
            Page {pageIndex + 1} of {pageCount || 1}
          </span>
          <button
            className="rounded border border-gray-300 px-2 py-1 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={gotoNext}
            disabled={!canNextPage}
          >
            Next ›
          </button>
          <button
            className="rounded border border-gray-300 px-2 py-1 text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={gotoLast}
            disabled={!canNextPage}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
