import apiClient from '../apiClient';
import { Order, CheckoutFormData, CartItem } from '../../types';

export interface CreateOrderDto {
  items: Array<{
    productId: number;
    qty: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: CheckoutFormData;
}

/**
 * Orders Service
 * Implements Single Responsibility Principle - handles only order operations
 */
export class OrdersService {
  private readonly ORDERS_ENDPOINT = '/orders';

  /**
   * Create new order
   */
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await apiClient.post<Order>(this.ORDERS_ENDPOINT, orderData);
    return response;
  }

  /**
   * Get user's order history
   */
  async getOrders(page: number = 1, limit: number = 10): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(this.ORDERS_ENDPOINT, {
      page,
      limit,
    });
    return response;
  }

  /**
   * Get single order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    const response = await apiClient.get<Order>(`${this.ORDERS_ENDPOINT}/${orderId}`);
    return response;
  }

  /**
   * Search orders by order ID
   */
  async searchOrders(query: string): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(this.ORDERS_ENDPOINT, {
      search: query,
    });
    return response;
  }

  /**
   * Calculate shipping cost based on method
   */
  calculateShipping(method: 'standard' | 'express' | 'overnight'): number {
    const shippingCosts = {
      standard: 5.99,
      express: 12.99,
      overnight: 24.99,
    };
    return shippingCosts[method];
  }

  /**
   * Apply promo code discount
   */
  applyPromoCode(code: string, subtotal: number): number {
    const promoCodes: Record<string, number> = {
      SAVE10: 0.1, // 10% off
      SAVE20: 0.2, // 20% off
      FIRSTORDER: 0.15, // 15% off
    };

    const discount = promoCodes[code.toUpperCase()] || 0;
    return subtotal * discount;
  }

  /**
   * Prepare order data from cart items
   */
  prepareOrderData(
    cartItems: CartItem[],
    formData: CheckoutFormData,
    subtotal: number
  ): CreateOrderDto {
    const shipping = this.calculateShipping(formData.shippingMethod);
    const discount = formData.promoCode
      ? this.applyPromoCode(formData.promoCode, subtotal)
      : 0;
    const total = subtotal + shipping - discount;

    return {
      items: cartItems.map((item) => ({
        productId: item.product.id,
        qty: item.qty,
        price: item.product.price,
      })),
      subtotal,
      shipping,
      discount,
      total,
      shippingAddress: formData,
    };
  }
}

// Export singleton instance
export const ordersService = new OrdersService();
export default ordersService;
