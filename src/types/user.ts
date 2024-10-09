export interface User {
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
