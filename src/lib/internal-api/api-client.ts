import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { auth } from "@clerk/nextjs/server";
import {
  ApiResponse,
  UserData,
  WorkspaceData,
  DealData,
  CompanyData,
} from "./types";

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://crm.vegardenterprises.com/internal/v1/",
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
        console.error(
          `API client error for ${method} ${url}:`,
          axiosError.message
        );
        return {
          success: false,
          status: axiosError.response?.status || 500,
          data: [],
        };
      } else {
        console.error(`Unexpected error for ${method} ${url}:`, error);
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
    get: (workspaceId: string) => this.request<WorkspaceData>("get", `companies/${workspaceId}`),
    create: (workspaceData: Partial<WorkspaceData>) => this.request<WorkspaceData>("post", "companies/", workspaceData),
    update: (workspaceId: string, workspaceData: Partial<WorkspaceData>) => this.request<WorkspaceData>("patch", `companies/${workspaceId}`, workspaceData),
    delete: (workspaceId: string) => this.request<WorkspaceData>("delete", `companies/${workspaceId}`),
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
    getAll: (companyId: string, pageSize?: number, page?: number) => {
      let url = `companies/${companyId}/customers`;
      if (pageSize !== undefined && page !== undefined) {
        url += `?page_size=${pageSize}&page=${page}`;
      }
      return this.request<CompanyData[]>("get", url);
    },
    get:    (customerId: string) => this.request<CompanyData>("get", `/customers/${customerId}`),
    create: (companyId: string, companyData: Partial<CompanyData>) => this.request<CompanyData>("post", `companies/${companyId}/customers/`, companyData),
    update: (customerId: string, companyData: Partial<CompanyData>) => this.request<CompanyData>("patch", `/customers/${customerId}`, companyData),
    delete: (customerId: string) => this.request<CompanyData>("delete", `/customers/${customerId}`),
  };
}

export const apiClient = new ApiClient();
