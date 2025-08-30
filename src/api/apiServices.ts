import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '@/src/components/utils/storage';
import { API_CONFIG } from './config';

class ApiService {
  private instance: AxiosInstance;
  private formDataInstance: AxiosInstance;

  constructor() {
    // Create main API instance
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Create form-data API instance
    this.formDataInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for main instance
    this.instance.interceptors.request.use(
      (config) => this.handleRequestInterceptor(config),
      (error) => Promise.reject(error)
    );

    // Response interceptor for main instance
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error)
    );

    // Request interceptor for form-data instance
    this.formDataInstance.interceptors.request.use(
      (config) => this.handleRequestInterceptor(config),
      (error) => Promise.reject(error)
    );

    // Response interceptor for form-data instance
    this.formDataInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleResponseError(error)
    );
  }

  private handleRequestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    const token = storage.getString('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }

  private handleResponseError(error: any) {
    // Handle common error scenarios
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized
          break;
        case 403:
          // Handle forbidden
          break;
        case 404:
          // Handle not found
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }

  // Generic request methods
  public async get<T>(endpoint: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(`/${API_CONFIG.API_VERSION}${endpoint}`, config);
  }

  public async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post<T>(`/${API_CONFIG.API_VERSION}${endpoint}`, data, config);
  }

  public async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put<T>(`/${API_CONFIG.API_VERSION}${endpoint}`, data, config);
  }

  public async delete<T>(endpoint: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(`/${API_CONFIG.API_VERSION}${endpoint}`, config);
  }

  // Form data methods
  public async postFormData<T>(endpoint: string, data: FormData, config?: AxiosRequestConfig) {
    return this.formDataInstance.post<T>(`/${API_CONFIG.API_VERSION}${endpoint}`, data, config);
  }

  public async putFormData<T>(endpoint: string, data: FormData, config?: AxiosRequestConfig) {
    return this.formDataInstance.put<T>(`/${API_CONFIG.API_VERSION}${endpoint}`, data, config);
  }
}

export const apiService = new ApiService();
export default apiService; 