import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { auth } from "@clerk/nextjs/server";
import { ApiResponse, UserData, CompanyData, DealData } from "./types";

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

  users = {
    get: (userId: string) => this.request<UserData>("get", `users/${userId}`),
    create: (userData: Partial<UserData>) =>
      this.request<UserData>("post", "users", userData),
    update: (userId: string, userData: Partial<UserData>) =>
      this.request<UserData>("patch", `users/${userId}`, userData),
    delete: (userId: string) =>
      this.request<UserData>("delete", `users/${userId}`),
  };

  companies = {
    get: (companyId: string) =>
      this.request<CompanyData>("get", `companies/${companyId}`),
    create: (companyData: Partial<CompanyData>) =>
      this.request<CompanyData>("post", "companies", companyData),
    update: (companyId: string, companyData: Partial<CompanyData>) =>
      this.request<CompanyData>("patch", `companies/${companyId}`, companyData),
    delete: (companyId: string) =>
      this.request<CompanyData>("delete", `companies/${companyId}`),
  };

  deals = {
    get: (dealId: string) => this.request<DealData>("get", `deals/${dealId}`),
    create: (dealData: Partial<DealData>) =>
      this.request<DealData>("post", "deals", dealData),
    update: (dealId: string, dealData: Partial<DealData>) =>
      this.request<DealData>("patch", `deals/${dealId}`, dealData),
    delete: (dealId: string) =>
      this.request<DealData>("delete", `deals/${dealId}`),
  };
}

export const apiClient = new ApiClient();
