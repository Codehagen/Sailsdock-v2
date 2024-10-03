import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { auth } from "@clerk/nextjs/server";

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data: T[];
  pagination?: {
    next: string | null;
    prev: string | null;
  };
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  public get: {
    userdata: (userId: string) => Promise<ApiResponse<any>>;
    // Add other GET endpoints here
  };
  public post: {
    user: (userData: Record<string, unknown>) => Promise<ApiResponse<any>>;
    // Add other POST endpoints here
  };
  public patch: {
    user: (
      userId: string,
      userData: Record<string, unknown>
    ) => Promise<ApiResponse<any>>;
    // Add other PATCH endpoints here
  };
  public delete: {
    user: (userId: string) => Promise<ApiResponse<any>>;
    // Add other DELETE endpoints here
  };

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://crm.vegardenterprises.com/internal/v1/",
      headers: {
        "Content-Type": "application/json",
        "X-CITADEL-LOCK": process.env.FRONTEND_LOCK || "",
        "X-CITADEL-KEY": process.env.FRONTEND_KEY || "",
        "X-CITADEL-ID": process.env.FRONTEND_ID || "",
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

    // Initialize endpoint methods
    this.get = {
      userdata: (userId: string) => this.request("get", `users/${userId}`),
    };
    this.post = {
      user: (userData: Record<string, unknown>) =>
        this.request("post", "users", userData),
    };
    this.patch = {
      user: (userId: string, userData: Record<string, unknown>) =>
        this.request("patch", `users/${userId}`, userData),
    };
    this.delete = {
      user: (userId: string) => this.request("delete", `users/${userId}`),
    };
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
}

export const apiClient = new ApiClient();
