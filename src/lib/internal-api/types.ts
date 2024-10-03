export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T[];
  pagination?: {
    next: string | null;
    prev: string | null;
  };
}

export interface UserData {
  company_details: any;
  clerk_id: string;
  username: string;
  first_name: string;
  last_name: string;
  id: string;
  name: string;
  email: string;
  // Add other user properties
}

export interface CompanyData {
  id: number;
  owner_details: {
    id: number;
    clerk_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  labels: Array<any>; // Consider defining a more specific type for labels if possible
  uuid: string;
  date_created: string;
  name: string;
  orgnr: string;
  address_city: string;
  address_zip: string;
  address_1: string;
  address_2: string;
  type: string | null;
  url: string | null;
  num_employees: number;
  fiken_id: string;
  sms_count: number;
  owner: number;
  referral: any | null; // Consider defining a more specific type for referral if possible
}

export interface DealData {
  id: string;
  title: string;
  // Add other deal properties
}

// You can add more interfaces or types here as needed
