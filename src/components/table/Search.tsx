import React from "react";

interface SearchProps {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  hasFilterableColumns: boolean;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount: number;
}

const Search: React.FC<SearchProps> = ({
  globalFilter,
  onGlobalFilterChange,
  hasFilterableColumns,
  showFilters,
  onToggleFilters,
  activeFiltersCount,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:space-x-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(e) => onGlobalFilterChange(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <svg
            className="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {hasFilterableColumns && (
          <button
            onClick={onToggleFilters}
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              showFilters
                ? "border border-blue-200 bg-blue-100 text-blue-700"
                : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;
