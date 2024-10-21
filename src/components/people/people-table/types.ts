export interface Person {
  id: number;
  uuid: string;
  name: string;
  phone: string | null;
  title: string | null;
  email: string;
  company: {
    id: number;
    name: string;
    uuid: string;
  } | null;
  last_modified: string;
}
