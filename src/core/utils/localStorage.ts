/**
 * LocalStorage Utility
 * Implements Single Responsibility Principle - handles only localStorage operations
 * Provides type-safe localStorage access with error handling
 */

export class LocalStorageUtil {
  /**
   * Get item from localStorage with type safety
   */
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage with serialization
   */
  static setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  /**
   * Clear all localStorage data
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Check if key exists in localStorage
   */
  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Get string item without JSON parsing
   */
  static getString(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading string from localStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set string item without JSON serialization
   */
  static setString(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing string to localStorage key "${key}":`, error);
    }
  }
}

// Specific storage keys used in the application
export const STORAGE_KEYS = {
  CART: 'marketfy_cart',
  TOKEN: 'token',
  USER_ID: 'userId',
  THEME: 'theme_preference',
} as const;

export default LocalStorageUtil;
