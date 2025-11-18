import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { CartItem, Product } from '../../../core/types';
import { LocalStorageUtil, getCartKey } from '../../../core/utils';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * Load cart from localStorage using user-specific key
 */
const loadCartFromStorage = (): CartItem[] => {
  const savedCart = LocalStorageUtil.getItem<CartItem[]>(getCartKey());
  return savedCart || [];
};

/**
 * Save cart to localStorage using user-specific key
 */
const saveCartToStorage = (items: CartItem[]): void => {
  LocalStorageUtil.setItem(getCartKey(), items);
};

/**
 * Calculate cart total
 */
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
};

/**
 * Calculate total item count
 */
const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.qty, 0);
};

const initialItems = loadCartFromStorage();

const initialState: CartState = {
  items: initialItems,
  total: calculateTotal(initialItems),
  itemCount: calculateItemCount(initialItems),
};

/**
 * Cart Slice
 * Manages shopping cart state with localStorage persistence
 * Implements Single Responsibility Principle - handles only cart operations
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add product to cart or increase quantity if already exists
     */
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({
          product: action.payload,
          qty: 1,
        });
      }

      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    /**
     * Remove product from cart completely
     */
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    /**
     * Update product quantity in cart
     */
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: number; qty: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload.productId
      );

      if (item) {
        if (action.payload.qty <= 0) {
          state.items = state.items.filter(
            (item) => item.product.id !== action.payload.productId
          );
        } else {
          item.qty = action.payload.qty;
        }
      }

      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
      saveCartToStorage(state.items);
    },

    /**
     * Increase product quantity by 1
     */
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.product.id === action.payload);
      if (item) {
        item.qty += 1;
        state.total = calculateTotal(state.items);
        state.itemCount = calculateItemCount(state.items);
        saveCartToStorage(state.items);
      }
    },

    /**
     * Decrease product quantity by 1
     */
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item) => item.product.id === action.payload);
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.product.id !== action.payload
          );
        }
        state.total = calculateTotal(state.items);
        state.itemCount = calculateItemCount(state.items);
        saveCartToStorage(state.items);
      }
    },

    /**
     * Clear entire cart
     */
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      saveCartToStorage([]);
    },

    /**
     * Load cart from localStorage (used for hydration)
     */
    loadCart: (state) => {
      state.items = loadCartFromStorage();
      state.total = calculateTotal(state.items);
      state.itemCount = calculateItemCount(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  loadCart,
} = cartSlice.actions;

export default cartSlice.reducer;
