export type DataType = "string" | "number" | "date" | "currency" | "status";

export interface HeaderConfig {
  key: string;
  label: string;
  type: DataType;
  sortable?: boolean;
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
