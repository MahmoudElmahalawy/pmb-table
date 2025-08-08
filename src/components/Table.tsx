import React from "react";
import type { TableComponentProps, HeaderConfig } from "../types/table";

const Table: React.FC<TableComponentProps> = ({
  headersConfig,
  data,
  className = "",
}) => {
  // Helper function to format cell value based on data type
  const formatCellValue = (value: any, config: HeaderConfig): string => {
    switch (config.type) {
      case "date":
        return new Date(value).toLocaleDateString("en-US", {
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

  // Helper function to get status badge styling
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

  // Helper function to get cell styling based on type and alignment
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

  // Get header keys in order
  const headerKeys = Object.keys(headersConfig);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              {headerKeys.map((key) => {
                const config = headersConfig[key];
                return (
                  <th
                    key={key}
                    className={`px-4 py-3 text-xs font-medium tracking-wider text-gray-500 ${
                      config.width ? `w-${config.width}` : ""
                    } ${
                      config.align === "center"
                        ? "text-center"
                        : config.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                    style={config.width ? { width: config.width } : undefined}
                  >
                    {config.label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="transition-colors duration-150 ease-in-out hover:bg-gray-50"
              >
                {headerKeys.map((key) => {
                  const config = headersConfig[key];
                  const value = row[key];
                  const formattedValue = formatCellValue(value, config);

                  return (
                    <td key={key} className={getCellClass(config)}>
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
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

export default Table;
