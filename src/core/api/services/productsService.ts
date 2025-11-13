import apiClient from '../apiClient';
import { Product, ProductsResponse, ProductSearchParams } from '../../types';

/**
 * Products Service
 * Implements Single Responsibility Principle - handles only product operations
 */
export class ProductsService {
  private readonly PRODUCTS_ENDPOINT = '/products';

  /**
   * Get paginated list of products with optional filters
   */
  async getProducts(params?: ProductSearchParams): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>(
      this.PRODUCTS_ENDPOINT,
      params
    );
    return response;
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.PRODUCTS_ENDPOINT}/${id}`);
    return response;
  }

  /**
   * Search products by query string
   */
  async searchProducts(query: string, page: number = 1, limit: number = 12): Promise<ProductsResponse> {
    return this.getProducts({ q: query, page, limit });
  }

  /**
   * Filter products by tag
   */
  async getProductsByTag(tag: string, page: number = 1, limit: number = 12): Promise<ProductsResponse> {
    return this.getProducts({ tag, page, limit });
  }

  /**
   * Get products with sorting
   */
  async getSortedProducts(
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    page: number = 1,
    limit: number = 12
  ): Promise<ProductsResponse> {
    return this.getProducts({ sortBy, sortOrder, page, limit });
  }
}

// Export singleton instance
export const productsService = new ProductsService();
export default productsService;
