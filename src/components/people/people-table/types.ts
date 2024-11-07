import { RowData, Table } from "@tanstack/react-table";

export interface Person {
  id: number;
  uuid: string;
  name: string;
  phone: string | null;
  email: string | null;
  title: string | null;
  company: {
    id: number;
    name: string;
    uuid: string;
  } | null;
  last_modified: string;
}

export interface DataTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> extends DataTableMeta<TData> {}
}