import type { ColumnDef } from "@tanstack/react-table";

export type DataType = "string" | "number" | "date" | "currency" | "status";

export interface HeaderConfig {
  key: string;
  label: string;
  type: DataType;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface HeadersConfig {
  [key: string]: HeaderConfig;
}

export interface TableData {
  [key: string]: any;
}

export interface TableComponentProps {
  headersConfig: HeadersConfig;
  data: TableData[];
  className?: string;
}

// TanStack Table specific types
export type TableColumnDef = ColumnDef<TableData, any>;

export interface FilterState {
  [key: string]: string;
}

export interface SortState {
  id: string;
  desc: boolean;
}
