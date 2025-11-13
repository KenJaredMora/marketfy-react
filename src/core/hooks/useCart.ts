import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  increaseQuantity as increaseQuantityAction,
  decreaseQuantity as decreaseQuantityAction,
  clearCart as clearCartAction,
} from '../../app/store/slices/cartSlice';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectIsInCart,
} from '../../app/store/selectors';
import { showSuccessToast } from '../../app/store/slices/uiSlice';
import { Product } from '../types';

/**
 * Custom hook for cart operations
 * Implements Single Responsibility Principle - handles only cart-related logic
 *
 * @returns Cart state and operations
 */
export const useCart = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const itemCount = useAppSelector(selectCartItemCount);

  /**
   * Add product to cart
   */
  const addToCart = useCallback(
    (product: Product) => {
      dispatch(addToCartAction(product));
      dispatch(showSuccessToast(`${product.name} added to cart`));
    },
    [dispatch]
  );

  /**
   * Remove product from cart
   */
  const removeFromCart = useCallback(
    (productId: number) => {
      const item = items.find((item) => item.product.id === productId);
      dispatch(removeFromCartAction(productId));
      if (item) {
        dispatch(showSuccessToast(`${item.product.name} removed from cart`));
      }
    },
    [dispatch, items]
  );

  /**
   * Update product quantity
   */
  const updateQuantity = useCallback(
    (productId: number, qty: number) => {
      dispatch(updateQuantityAction({ productId, qty }));
    },
    [dispatch]
  );

  /**
   * Increase product quantity by 1
   */
  const increaseQuantity = useCallback(
    (productId: number) => {
      dispatch(increaseQuantityAction(productId));
    },
    [dispatch]
  );

  /**
   * Decrease product quantity by 1
   */
  const decreaseQuantity = useCallback(
    (productId: number) => {
      dispatch(decreaseQuantityAction(productId));
    },
    [dispatch]
  );

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    dispatch(clearCartAction());
    dispatch(showSuccessToast('Cart cleared'));
  }, [dispatch]);

  /**
   * Check if product is in cart
   */
  const isInCart = useCallback(
    (productId: number): boolean => {
      return items.some((item) => item.product.id === productId);
    },
    [items]
  );

  /**
   * Get cart item by product ID
   */
  const getCartItem = useCallback(
    (productId: number) => {
      return items.find((item) => item.product.id === productId);
    },
    [items]
  );

  /**
   * Get quantity of product in cart
   */
  const getQuantity = useCallback(
    (productId: number): number => {
      const item = items.find((item) => item.product.id === productId);
      return item ? item.qty : 0;
    },
    [items]
  );

  return {
    items,
    total,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isInCart,
    getCartItem,
    getQuantity,
  };
};

export default useCart;
