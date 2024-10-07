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
  id: number;
  uuid: string;
  clerk_id: string;
  phone: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar: string | null;
  date_created: string;
  last_updated: string;
  company: number;
  company_details: {
    uuid: string;
    name: string;
    orgnr: string;
  };
  department: number | null;
  department_details: any | null;
  budget: number | null;
  where_heard: string;
  onboardingStage: number;
  hasCompletedOnboarding: boolean;
  hasAcceptedTOS: boolean;
  integration_name: string;
  integration_company: string;
  task_count: number;
  use_flows: boolean;
  is_subscribed: boolean;
  trial_expired: boolean;
  profile: any | null;
}

export interface WorkspaceData {
  id: number;
  uuid: string;
  date_created: string;
  name: string;
  orgnr: string;
  address_street: string;
  address_zip: string;
  address_city: string;
  url: string | null;
  type: string;
  business: boolean;
  status: string;
  priority: string;
  stage: number;
  company: number;
  user: number;
  contact: number | null;
}

export interface DealData {
  id: string;
  title: string;
  // Add other deal properties
}

export interface CompanyData {
  readonly id: string | number;
  readonly uuid: string;
  type: string;
  name: string;
  user_name?: string;
  orgnr: string;
  contact_person: string;
  title?: string;
  url?: string;
  address_street: string;
  address_zip: string;
  address_city: string;
  phone: string;
  email: string;
  label: string;
  status: string;
  priority: string;
  preferred_communication: string;
  num_employees?: string;
  board_members?: any;
  last_contacted: string;
  default_contact?: {
    name: string;
    // Add other properties of default_contact as needed
  };
}

// You can add more interfaces or types here as needed
