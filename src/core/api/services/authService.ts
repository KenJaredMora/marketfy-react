import apiClient from '../apiClient';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../../types';

/**
 * Authentication Service
 * Implements Single Responsibility Principle - handles only authentication operations
 */
export class AuthService {
  private readonly AUTH_ENDPOINT = '/auth';

  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.AUTH_ENDPOINT}/login`,
      credentials
    );
    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      `${this.AUTH_ENDPOINT}/register`,
      data
    );
    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response;
  }

  /**
   * Validate token expiration
   */
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  /**
   * Store authentication data
   */
  storeAuthData(token: string, userId: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
  }

  /**
   * Clear authentication data
   */
  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get stored user ID
   */
  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
