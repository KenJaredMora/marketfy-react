import apiClient from '../apiClient';
import { WishlistItem } from '../../types';

/**
 * Wishlist Service
 * Implements Single Responsibility Principle - handles only wishlist operations
 */
export class WishlistService {
  private readonly WISHLIST_ENDPOINT = '/wishlist';

  /**
   * Get user's wishlist
   */
  async getWishlist(): Promise<WishlistItem[]> {
    const response = await apiClient.get<WishlistItem[]>(this.WISHLIST_ENDPOINT);
    return response;
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId: number): Promise<WishlistItem> {
    const response = await apiClient.post<WishlistItem>(this.WISHLIST_ENDPOINT, {
      productId,
    });
    return response;
  }

  /**
   * Remove item from wishlist by wishlist item ID
   */
  async removeFromWishlist(wishlistItemId: number): Promise<void> {
    await apiClient.delete(`${this.WISHLIST_ENDPOINT}/${wishlistItemId}`);
  }

  /**
   * Remove item from wishlist by product ID
   */
  async removeByProductId(productId: number): Promise<void> {
    await apiClient.delete(`${this.WISHLIST_ENDPOINT}?productId=${productId}`);
  }

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(productId: number, wishlistItems: WishlistItem[]): boolean {
    return wishlistItems.some((item) => item.productId === productId);
  }

  /**
   * Get wishlist item by product ID
   */
  findWishlistItem(productId: number, wishlistItems: WishlistItem[]): WishlistItem | undefined {
    return wishlistItems.find((item) => item.productId === productId);
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();
export default wishlistService;
