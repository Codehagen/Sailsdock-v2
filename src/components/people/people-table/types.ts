import { Table } from "@tanstack/react-table";

export interface Company {
  id: number;
  uuid: string;
  name: string;
  orgnr: string;
}

export interface Person {
  id: number;
  uuid: string;
  name: string;
  phone: string | null;
  email: string | null;
  title: string | null;
  companies: Company[];
  opportunities: any[]; // Define specific type if needed
  date_created: string;
  last_modified: string;
  department: string;
  address_street: string;
  address_zip: string;
  address_city: string;
  pref_com: string;
  url: string;
  user: number;
  workspace: number;
  company: number;
}

export interface DataTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

declare module "@tanstack/table-core" {
  interface TableMeta<TData extends RowData> extends DataTableMeta<TData> {}
}
