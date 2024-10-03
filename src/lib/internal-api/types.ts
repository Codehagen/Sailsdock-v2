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
  id: string;
  name: string;
  email: string;
  // Add other user properties
}

export interface CompanyData {
  id: string;
  name: string;
  // Add other company properties
}

export interface DealData {
  id: string;
  title: string;
  // Add other deal properties
}

// You can add more interfaces or types here as needed
