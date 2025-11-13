import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

/**
 * Redux Selectors
 * Implements memoization using createSelector from Redux Toolkit
 * Follows best practices for selector organization
 */

// ============================================
// Auth Selectors
// ============================================

export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// ============================================
// Cart Selectors
// ============================================

export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;

// Memoized selector to check if a product is in cart
export const selectIsInCart = (productId: number) =>
  createSelector([selectCartItems], (items) =>
    items.some((item) => item.product.id === productId)
  );

// Memoized selector to get cart item by product ID
export const selectCartItemByProductId = (productId: number) =>
  createSelector([selectCartItems], (items) =>
    items.find((item) => item.product.id === productId)
  );

// ============================================
// Products Selectors
// ============================================

export const selectProducts = (state: RootState) => state.products;
export const selectProductsList = (state: RootState) => state.products.products;
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct;
export const selectProductsLoading = (state: RootState) => state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductsPagination = createSelector(
  [selectProducts],
  (products) => ({
    page: products.page,
    limit: products.limit,
    total: products.total,
    totalPages: products.totalPages,
  })
);
export const selectSearchQuery = (state: RootState) => state.products.searchQuery;
export const selectSelectedTag = (state: RootState) => state.products.selectedTag;

// ============================================
// Wishlist Selectors
// ============================================

export const selectWishlist = (state: RootState) => state.wishlist;
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistLoading = (state: RootState) => state.wishlist.isLoading;
export const selectWishlistError = (state: RootState) => state.wishlist.error;

// Memoized selector for wishlist count
export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

// Memoized selector to check if a product is in wishlist
export const selectIsInWishlist = (productId: number) =>
  createSelector([selectWishlistItems], (items) =>
    items.some((item) => item.productId === productId)
  );

// Memoized selector to get wishlist item by product ID
export const selectWishlistItemByProductId = (productId: number) =>
  createSelector([selectWishlistItems], (items) =>
    items.find((item) => item.productId === productId)
  );

// ============================================
// Orders Selectors
// ============================================

export const selectOrders = (state: RootState) => state.orders;
export const selectOrdersList = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) => state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectLastCreatedOrderId = (state: RootState) =>
  state.orders.lastCreatedOrderId;

// Memoized selector for order count
export const selectOrdersCount = createSelector(
  [selectOrdersList],
  (orders) => orders.length
);

// ============================================
// UI Selectors
// ============================================

export const selectUI = (state: RootState) => state.ui;
export const selectGlobalLoading = (state: RootState) => state.ui.isGlobalLoading;
export const selectToasts = (state: RootState) => state.ui.toasts;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;

// ============================================
// Combined/Computed Selectors
// ============================================

/**
 * Get product with wishlist status
 */
export const selectProductWithWishlistStatus = (productId: number) =>
  createSelector(
    [
      (state: RootState) => state.products.products,
      (state: RootState) => state.wishlist.items,
    ],
    (products, wishlistItems) => {
      const product = products.find((p) => p.id === productId);
      const isInWishlist = wishlistItems.some((item) => item.productId === productId);
      return product ? { ...product, isInWishlist } : null;
    }
  );

/**
 * Get all products with their wishlist status
 */
export const selectProductsWithWishlistStatus = createSelector(
  [selectProductsList, selectWishlistItems],
  (products, wishlistItems) =>
    products.map((product) => ({
      ...product,
      isInWishlist: wishlistItems.some((item) => item.productId === product.id),
    }))
);
