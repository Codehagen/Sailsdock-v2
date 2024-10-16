export interface Company {
  id: number;
  uuid: string;
  name: string;
  orgnr: string;
  url: string;
  num_employees: number;
  arr: number;
  last_contacted: string;
  account_owners: Array<{
    id: number;
    clerk_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  }>;
  user: {
    id: number;
    clerk_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  // ... other fields
}
