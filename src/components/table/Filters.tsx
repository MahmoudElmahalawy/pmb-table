import React from "react";
import type { HeaderConfig } from "../../types/table";

interface FiltersProps {
  headersConfig: Record<string, HeaderConfig>;
  getColumnFilterValue: (key: string) => string;
  setColumnFilterValue: (key: string, value: string) => void;
  isColumnActive: (key: string) => boolean;
  statusOptionsByKey: Record<string, string[]>;
}

const NumberFilter: React.FC<{
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  isActive: boolean;
}> = ({ id, value, onChange, placeholder, isActive }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^-?\d*\.?\d*$/.test(inputValue)) {
      onChange(inputValue);
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        className={`h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
          isActive ? "border-blue-300" : "border-gray-300"
        }`}
      />
      {isActive && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const DateRangeFilter: React.FC<{
  fromId: string;
  toId: string;
  value: string;
  onChange: (value: string) => void;
  isActive: boolean;
}> = ({ fromId, toId, value, onChange, isActive }) => {
  const [fromDate, toDate] = value ? value.split("|") : ["", ""];

  const update = (f: string, t: string) => {
    const newValue = f && t ? `${f}|${t}` : f || t || "";
    onChange(newValue);
  };

  return (
    <div className="relative min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        <input
          id={fromId}
          aria-label="From date"
          type="datetime-local"
          value={fromDate}
          onChange={(e) => update(e.target.value, toDate)}
          className={`h-10 min-w-0 flex-1 rounded-md border bg-white px-2 py-1 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
            fromDate ? "border-blue-300" : "border-gray-300"
          }`}
        />
        <span className="text-gray-400">–</span>
        <input
          id={toId}
          aria-label="To date"
          type="datetime-local"
          value={toDate}
          onChange={(e) => update(fromDate, e.target.value)}
          className={`h-10 min-w-0 flex-1 rounded-md border bg-white px-2 py-1 pr-6 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
            toDate ? "border-blue-300" : "border-gray-300"
          }`}
        />
      </div>
      {isActive && (
        <button
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear date range filter"
          title="Clear"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const Filters: React.FC<FiltersProps> = ({
  headersConfig,
  getColumnFilterValue,
  setColumnFilterValue,
  isColumnActive,
  statusOptionsByKey,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Column Filters</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Object.entries(headersConfig)
          .filter(([_, config]) => config.filterable !== false)
          .map(([key, config]) => {
            const value = getColumnFilterValue(key);
            const isActive = isColumnActive(key);
            const inputIdBase = `filter-${key}`;

            return (
              <div
                key={key}
                className={`space-y-1 ${config.type === "date" ? "sm:col-span-2" : ""}`}
              >
                <label
                  className="block text-xs font-medium text-gray-600"
                  htmlFor={
                    config.type === "date" ? `${inputIdBase}-from` : inputIdBase
                  }
                >
                  {config.label}
                </label>
                {config.type === "date" ? (
                  <DateRangeFilter
                    fromId={`${inputIdBase}-from`}
                    toId={`${inputIdBase}-to`}
                    value={value ?? ""}
                    onChange={(v) => setColumnFilterValue(key, v)}
                    isActive={isActive}
                  />
                ) : config.type === "number" ? (
                  <NumberFilter
                    id={inputIdBase}
                    value={value ?? ""}
                    onChange={(v) => setColumnFilterValue(key, v)}
                    placeholder={`Filter ${config.label.toLowerCase()}...`}
                    isActive={isActive}
                  />
                ) : config.type === "status" ? (
                  <div className="relative">
                    <select
                      id={inputIdBase}
                      value={value ?? ""}
                      onChange={(e) =>
                        setColumnFilterValue(key, e.target.value)
                      }
                      className={`h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                        isActive ? "border-blue-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">All</option>
                      {(statusOptionsByKey[key] || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      id={inputIdBase}
                      type="text"
                      placeholder={`Filter ${config.label.toLowerCase()}...`}
                      value={value ?? ""}
                      onChange={(e) =>
                        setColumnFilterValue(key, e.target.value)
                      }
                      className={`h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                        isActive ? "border-blue-300" : "border-gray-300"
                      }`}
                    />
                    {isActive && (
                      <button
                        onClick={() => setColumnFilterValue(key, "")}
                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Filters;
