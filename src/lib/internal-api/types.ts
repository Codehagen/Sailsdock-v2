export interface ApiResponse<T> {
  success: boolean;
  data: T;
  status?: number;
  pagination?: {
    next: string | null;
    prev: string | null;
    count: number;
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
    id: string;
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
  id: number;
  uuid: string;
  name: string;
  orgnr: string;
  arr: number;
  opportunities: any[]; // Replace 'any' with proper type if available
  account_owners: any[]; // Replace 'any' with proper type if available
  user: any; // Replace 'any' with proper type if available
  url: string;
  num_employees: number;
  last_contacted: string;
}

// You can add more interfaces or types here as needed

export interface AccountOwner {
  id: number;
  clerk_id: string;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface WorkspaceData {
  id: number;
  clerk_id?: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  // ... any other properties ...
}

export interface NoteData {
  id: string;
  title: string;
  description: string;
  companyId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface OpportunityData {
  id: number;
  uuid: string;
  name: string;
  description: string;
  status: string;
  stage: string;
  value: number;
  est_completion: string | null;
  date_completed: string | null;
  is_closed: boolean;
  is_won: boolean;
  step_1: boolean;
  step_2: boolean;
  step_3: boolean;
  step_4: boolean;
  step_5: boolean;
  special_tasks: string | null;
  date_created: string;
  last_updated: string | null;
  user: number;
  company: number;
  user_details: {
    id: number;
    clerk_id: string;
    email: string;
    username: string | null;
    first_name: string;
    last_name: string;
  };
  company_details: CompanyData;
  workspace: any | null; // You might want to define a more specific type if needed
  people: any[]; // You might want to define a more specific type if needed
  companies: number[]; // Changed from any[] to number[]
  account_owners: any[]; // You might want to define a more specific type if needed
}

export interface SidebarViewData {
  uuid: string;
  name: string;
  description: string;
  icon: string;
  url: string;
  sorting: number;
  fields: any | null;
  section?: string;
  user: number;
  parent_element: number;
}

export interface PersonData {
  id: number;
  uuid: string;
  name: string;
  title?: string;
  phone?: string;
  email?: string;
  date_created: string;
  last_modified: string;
  company: CompanyData | null;
  opportunities: OpportunityData[];
  companies: number[]; // Add this line to include the companies property
  // Add other properties as needed
}

// Make sure you have CompanyData and OpportunityData interfaces defined as well
export interface CompanyData {
  id: number;
  uuid: string;
  name: string;
  // ... other company properties
}

export interface OpportunityData {
  id: number;
  uuid: string;
  name: string;
  // ... other opportunity properties
}

export interface TaskData {
  id: number;
  class_type: string;
  user_details: {
    id: number;
    clerk_id: string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  company: number | null;
  opportunity: number | null;
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
  person: number | null;
  task_owner: number; // Add this line
  flow: number | null;
  element: number | null;
}

export interface TaskDetailsData extends Omit<TaskData, "company"> {
  company: {
    id: number;
    uuid: string;
    name: string;
    orgnr: string;
  } | null;
  task_supervisor: number | null;
  people: PersonData[];
  opportunities: OpportunityData[];
}
