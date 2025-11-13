import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ApiError } from '../types';

/**
 * API Client Configuration
 * Implements Single Responsibility Principle - handles only HTTP communication
 */
class ApiClient {
  private instance: AxiosInstance;
  private isLoadingCallback?: (loading: boolean) => void;
  private onErrorCallback?: (error: string) => void;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Configure loading state callback
   * Follows Dependency Inversion Principle - depends on abstraction (callback)
   */
  public setLoadingCallback(callback: (loading: boolean) => void): void {
    this.isLoadingCallback = callback;
  }

  /**
   * Configure error handler callback
   */
  public setErrorCallback(callback: (error: string) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request Interceptor - Add auth token and manage loading state
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Show loading indicator
        if (this.isLoadingCallback) {
          this.isLoadingCallback(true);
        }

        // Add authentication token if available
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => {
        if (this.isLoadingCallback) {
          this.isLoadingCallback(false);
        }
        return Promise.reject(error);
      }
    );

    // Response Interceptor - Handle responses and errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Hide loading indicator
        if (this.isLoadingCallback) {
          this.isLoadingCallback(false);
        }
        return response;
      },
      (error: AxiosError<ApiError>) => {
        // Hide loading indicator
        if (this.isLoadingCallback) {
          this.isLoadingCallback(false);
        }

        // Handle specific error cases
        if (error.response) {
          const errorMessage = error.response.data?.message || 'An error occurred';

          // Handle unauthorized errors
          if (error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/auth';
          }

          // Call error callback if defined
          if (this.onErrorCallback) {
            this.onErrorCallback(errorMessage);
          }

          return Promise.reject({
            message: errorMessage,
            statusCode: error.response.status,
            error: error.response.data?.error,
          } as ApiError);
        } else if (error.request) {
          const networkError = 'Network error. Please check your connection.';
          if (this.onErrorCallback) {
            this.onErrorCallback(networkError);
          }
          return Promise.reject({
            message: networkError,
            statusCode: 0,
          } as ApiError);
        } else {
          const genericError = error.message || 'An unexpected error occurred';
          if (this.onErrorCallback) {
            this.onErrorCallback(genericError);
          }
          return Promise.reject({
            message: genericError,
            statusCode: 0,
          } as ApiError);
        }
      }
    );
  }

  /**
   * Get the Axios instance for direct usage
   */
  public getClient(): AxiosInstance {
    return this.instance;
  }

  /**
   * Generic GET request
   */
  public async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  /**
   * Generic POST request
   */
  public async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.post<T>(url, data);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  public async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.put<T>(url, data);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  public async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.instance.patch<T>(url, data);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  public async delete<T>(url: string): Promise<T> {
    const response = await this.instance.delete<T>(url);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
