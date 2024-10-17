import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { auth } from "@clerk/nextjs/server";
import {
  ApiResponse,
  UserData,
  WorkspaceData,
  DealData,
  CompanyData,
  NoteData,
  OpportunityData,
  PersonData,
} from "./types";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://crm.vegardenterprises.com/internal/v2/",
      headers: {
        "Content-Type": "application/json",
        "X-CITADEL-LOCK": process.env.FRONTEND_LOCK || "",
        "X-CITADEL-KEY": process.env.FRONTEND_KEY || "",
        "X-CITADEL-ID": process.env.FRONTEND_ID || "",
        "Cache-Control": "no-cache",
      },
    });

    this.axiosInstance.interceptors.request.use(async (config) => {
      const { userId } = await auth();
      if (!userId) {
        throw new Error("Unauthorized");
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API request failed:", error);
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    method: "get" | "post" | "patch" | "delete",
    url: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.axiosInstance({
        method,
        url,
        data,
      });

      const isPaginated = response.data.results !== undefined;
      const dataArray = isPaginated ? response.data.results : response.data;

      return {
        success: response.status >= 200 && response.status < 300,
        status: response.status,
        data: Array.isArray(dataArray) ? dataArray : [dataArray],
        ...(isPaginated && {
          pagination: {
            next: response.data.next,
            prev: response.data.previous,
          },
        }),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorInfo = {
          message: axiosError.message,
          status: axiosError.response?.status,
          config: {
            baseURL: axiosError.config?.baseURL,
            method: axiosError.config?.method,
            url: axiosError.config?.url,
            data: axiosError.config?.data,
          },
          data:
            axiosError.response?.data &&
            typeof axiosError.response.data === "object"
              ? JSON.stringify(axiosError.response.data).slice(0, 100)
              : "Response data not available or not in expected format",
        };

        console.error(
          `API client error for ${method.toUpperCase()} ${url}:`,
          errorInfo
        );

        return {
          success: false,
          status: axiosError.response?.status || 500,
          data: [],
        };
      } else {
        console.error(
          `Unexpected error for ${method.toUpperCase()} ${url}:`,
          error
        );
        return {
          success: false,
          status: 500,
          data: [],
        };
      }
    }
  }

  // prettier-ignore
  users = {
    get: (userId: string) => this.request<UserData>("get", `users/${userId}`),
    create: (userData: Partial<UserData>) => this.request<UserData>("post", "users/", userData),
    update: (userId: string, userData: Partial<UserData>) => this.request<UserData>("patch", `users/${userId}/`, userData),
    delete: (userId: string) => this.request<UserData>("delete", `users/${userId}`),
  };
  // prettier-ignore
  workspaces = {
    get: (workspaceId: string) => this.request<WorkspaceData>("get", `workspaces/${workspaceId}/`),
    getUsers: (workspaceId: string) => this.request<UserData[]>("get", `workspaces/${workspaceId}/users/`),
    create: (workspaceData: Partial<WorkspaceData>) => this.request<WorkspaceData>("post", "workspaces/", workspaceData),
    update: (workspaceId: string, workspaceData: Partial<WorkspaceData>) => this.request<WorkspaceData>("patch", `workspaces/${workspaceId}/`, workspaceData),
    delete: (workspaceId: string) => this.request<WorkspaceData>("delete", `workspaces/${workspaceId}/`),
  };
  // prettier-ignore
  deals = {
    get: (dealId: string) => this.request<DealData>("get", `deals/${dealId}`),
    create: (dealData: Partial<DealData>) => this.request<DealData>("post", "deals/", dealData),
    update: (dealId: string, dealData: Partial<DealData>) => this.request<DealData>("patch", `deals/${dealId}`, dealData),
    delete: (dealId: string) => this.request<DealData>("delete", `deals/${dealId}`),
  };
  //TODO Change URL ENDPOINT WHEN @grax is ready
  // prettier-ignore
  company = {
    getAll: (workspaceId: string, pageSize?: number, page?: number) => {
      let url = `workspaces/${workspaceId}/companies`;
      if (pageSize !== undefined && page !== undefined) {
        url += `?page_size=${pageSize}&page=${page}`;
      }
      return this.request<CompanyData[]>("get", url);
    },
    get:    (companyId: string) => this.request<CompanyData>("get", `/companies/${companyId}`),
    create: (workspaceId: string, companyData: Partial<CompanyData>) => this.request<CompanyData>("post", `/companies/`, companyData),
    update: (companyId: string, companyData: Partial<CompanyData>) => this.request<CompanyData>("patch", `/companies/${companyId}/`, companyData),
    delete: (companyId: string) => this.request<CompanyData>("delete", `/companies/${companyId}`),
    getDetails: (companyId: string) => 
      this.request<CompanyData>("get", `/companies/${companyId}/details`),

     // prettier-ignore
    notes: {
      getAll: (pageSize?: number, page?: number) => {
        let url = "notes";
        if (pageSize !== undefined && page !== undefined) {
          url += `?page_size=${pageSize}&page=${page}`;
        }
        return this.request<NoteData[]>("get", url);
      },
      get: (noteId: string) => 
        this.request<NoteData>("get", `notes/${noteId}/`),
      create: (noteData: Partial<NoteData>) =>
        this.request<NoteData>("post", `/notes/`, noteData),
      update: (noteId: string, noteData: Partial<NoteData>) =>
        this.request<NoteData>("patch", `notes/${noteId}/`, noteData),
      delete: (noteId: string) => 
        this.request<NoteData>("delete", `notes/${noteId}/`),
    },
  };

  // Add this new section for opportunities
  opportunities = {
    getAll: (workspaceId: string, pageSize?: number, page?: number) => {
      let url = `workspaces/${workspaceId}/opportunities`;
      if (pageSize !== undefined && page !== undefined) {
        url += `?page_size=${pageSize}&page=${page}`;
      }
      return this.request<OpportunityData[]>("get", url);
    },
    get: (opportunityId: string) =>
      this.request<OpportunityData>("get", `/opportunities/${opportunityId}`),
    create: (opportunityData: Partial<OpportunityData>) =>
      this.request<OpportunityData>("post", `/opportunities/`, opportunityData),
    update: (
      opportunityId: string,
      opportunityData: Partial<OpportunityData>
    ) =>
      this.request<OpportunityData>(
        "patch",
        `/opportunities/${opportunityId}/`,
        opportunityData
      ),
    delete: (opportunityId: string) =>
      this.request<OpportunityData>(
        "delete",
        `/opportunities/${opportunityId}`
      ),
    getDetails: (opportunityId: string) =>
      this.request<OpportunityData>(
        "get",
        `/opportunities/${opportunityId}/details`
      ),

    // You can add a notes section for opportunities if needed, similar to the company notes
    notes: {
      getAll: (opportunityId: string, pageSize?: number, page?: number) => {
        let url = `opportunities/${opportunityId}/notes`;
        if (pageSize !== undefined && page !== undefined) {
          url += `?page_size=${pageSize}&page=${page}`;
        }
        return this.request<NoteData[]>("get", url);
      },
      get: (opportunityId: string, noteId: string) =>
        this.request<NoteData>(
          "get",
          `opportunities/${opportunityId}/notes/${noteId}/`
        ),
      create: (opportunityId: string, noteData: Partial<NoteData>) =>
        this.request<NoteData>(
          "post",
          `opportunities/${opportunityId}/notes/`,
          noteData
        ),
      update: (
        opportunityId: string,
        noteId: string,
        noteData: Partial<NoteData>
      ) =>
        this.request<NoteData>(
          "patch",
          `opportunities/${opportunityId}/notes/${noteId}/`,
          noteData
        ),
      delete: (opportunityId: string, noteId: string) =>
        this.request<NoteData>(
          "delete",
          `opportunities/${opportunityId}/notes/${noteId}/`
        ),
    },
  };

  // Add this new section for people
  people = {
    getAll: (workspaceId: string, pageSize?: number, page?: number) => {
      let url = `workspaces/${workspaceId}/people`;
      if (pageSize !== undefined && page !== undefined) {
        url += `?page_size=${pageSize}&page=${page}`;
      }
      return this.request<PersonData[]>("get", url);
    },
    get: (personId: string) =>
      this.request<PersonData>("get", `/people/${personId}/`),
    create: (personData: Partial<PersonData>) =>
      this.request<PersonData>("post", `/people/`, personData),
    update: (personId: string, personData: Partial<PersonData>) =>
      this.request<PersonData>("patch", `/people/${personId}/`, personData),
    delete: (personId: string) =>
      this.request<PersonData>("delete", `/people/${personId}`),
    getDetails: (personId: string) =>
      this.request<PersonData>("get", `/people/${personId}/details`),
  };
}

export const apiClient = new ApiClient();
