// src/core/api/services/ordersService.ts
import type { CartItem, CheckoutFormData, Order } from '../../types';
import apiClient from '../apiClient';

export interface CreateOrderItemDto {
  product: any;   // matches backend: product: any
  qty: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  total: number;
}

class OrdersService {
  private readonly ORDERS_ENDPOINT = '/orders';

  /**
   * Create order (POST /orders)
   * Sends ONLY the fields expected by the backend DTO
   */
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<Order>(this.ORDERS_ENDPOINT, dto);
    return response;
  }

  /**
   * Get user orders (GET /orders)
   * Backend returns { data, total, page, limit }
   * We only care about data (array of orders) on the frontend.
   */
  async getOrders(page?: number, limit?: number): Promise<Order[]> {
    const params: Record<string, any> = {};
    if (page != null) params.page = page;
    if (limit != null) params.limit = limit;

    const response = await apiClient.get<{
      data: Order[];
      total: number;
      page: number;
      limit: number;
    }>(this.ORDERS_ENDPOINT, params);

    return response.data;
  }

  /**
   * Get order by orderId (GET /orders/:orderId)
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(
      `${this.ORDERS_ENDPOINT}/${orderId}`
    );
    return response;
  }

  /**
   * "Search" orders client-side by orderId
   * (since backend doesn't expose a search endpoint)
   */
  async searchOrders(query: string): Promise<Order[]> {
    const all = await this.getOrders();
    const q = query.toLowerCase();
    return all.filter((o) => (o.orderId ?? '').toLowerCase().includes(q));
  }

  /**
   * Shipping calculation – used in CheckoutPage
   */
  calculateShipping(
    method: 'standard' | 'express' | 'overnight'
  ): number {
    switch (method) {
      case 'express':
        return 12.99;
      case 'overnight':
        return 24.99;
      default:
        return 5.99;
    }
  }

  /**
   * Promo code logic – used in CheckoutPage
   */
  applyPromoCode(code: string, subtotal: number): number {
    const normalized = code.trim().toUpperCase();

    if (!normalized) return 0;
    if (normalized === 'SAVE10') return subtotal * 0.1;
    if (normalized === 'SAVE20') return subtotal * 0.2;
    if (normalized === 'FIRSTORDER') return Math.min(15, subtotal * 0.15);

    // Unknown code → no discount
    return 0;
  }

  /**
   * Prepare payload to send to backend
   *
   * IMPORTANT: we only include:
   *   - items: { product: any, qty: number }[]
   *   - total: number
   *
   * Backend does NOT accept subtotal, shipping, discount, shippingAddress, etc.
   */
  prepareOrderData(
    items: CartItem[],
    _checkout: CheckoutFormData, // kept for future use if backend is extended
    total: number
  ): CreateOrderDto {
    return {
      items: items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
        },
        qty: item.qty,
      })),
      total,
    };
  }
}

export const ordersService = new OrdersService();
export default ordersService;
