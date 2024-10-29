import { Table } from "@tanstack/react-table";

export interface Task {
  id: number;
  class_type: string;
  user_details: {
    id: number;
    email: string;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    clerk_id: string;
  } | null;
  company: any | null;
  opportunity: any | null;
  uuid: string;
  date_created: string;
  title: string;
  description: string;
  date: string;
  status: string;
  type: string;
  task_type: string;
  estimated_time: string;
  reminder: string;
  auto_gen: boolean;
  user: number;
  person: any | null;
  task_owner: number;
  flow: any | null;
  element: any | null;
}

export interface DataTableMeta<TData> {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData> extends DataTableMeta<TData> {}
}
