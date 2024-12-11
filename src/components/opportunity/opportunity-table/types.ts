export interface Opportunity {
  id: number;
  uuid: string;
  name: string;
  stage: string;
  status: string;
  value: number;
  account_owners: Array<{
    id: number;
    clerk_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  }>;
  companies: number[];
}
