import apiClient from '../apiClient';
import { User, UpdateUserDto } from '../../types';

/**
 * Users Service
 * Implements Single Responsibility Principle - handles only user profile operations
 */
export class UsersService {
  private readonly USERS_ENDPOINT = '/users';

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(`${this.USERS_ENDPOINT}/me`);
    return response;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserDto): Promise<User> {
    const response = await apiClient.patch<User>(`${this.USERS_ENDPOINT}/me`, data);
    return response;
  }

  /**
   * Validate display name (min 3 chars, max 50 chars)
   */
  validateDisplayName(displayName: string): boolean {
    return displayName.length >= 3 && displayName.length <= 50;
  }

  /**
   * Validate bio (max 500 chars)
   */
  validateBio(bio: string): boolean {
    return bio.length <= 500;
  }

  /**
   * Format user's full name
   */
  getFullName(user: User): string {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.displayName;
  }
}

// Export singleton instance
export const usersService = new UsersService();
export default usersService;
