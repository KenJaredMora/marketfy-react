import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import {
  fetchWishlist,
  addToWishlist as addToWishlistAction,
  removeFromWishlist as removeFromWishlistAction,
  removeFromWishlistByProductId,
} from '../../app/store/slices/wishlistSlice';
import {
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistError,
  selectIsAuthenticated,
} from '../../app/store/selectors';
import { showSuccessToast, showErrorToast } from '../../app/store/slices/uiSlice';

/**
 * Custom hook for wishlist operations
 * Implements Single Responsibility Principle - handles only wishlist-related logic
 * Requires authentication
 *
 * @returns Wishlist state and operations
 */
export const useWishlist = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const items = useAppSelector(selectWishlistItems);
  const isLoading = useAppSelector(selectWishlistLoading);
  const error = useAppSelector(selectWishlistError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  /**
   * Load wishlist from backend
   */
  const loadWishlist = useCallback(async () => {
    if (isAuthenticated) {
      await dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  /**
   * Add product to wishlist
   */
  const addToWishlist = useCallback(
    async (productId: number, productName?: string) => {
      if (!isAuthenticated) {
        dispatch(showErrorToast('Please login to add items to wishlist'));
        return false;
      }

      const result = await dispatch(addToWishlistAction(productId));
      if (addToWishlistAction.fulfilled.match(result)) {
        dispatch(
          showSuccessToast(
            productName
              ? `${productName} added to wishlist`
              : 'Added to wishlist'
          )
        );
        return true;
      } else {
        dispatch(showErrorToast('Failed to add to wishlist'));
        return false;
      }
    },
    [dispatch, isAuthenticated]
  );

  /**
   * Remove item from wishlist by wishlist item ID
   */
  const removeFromWishlist = useCallback(
    async (wishlistItemId: number, productName?: string) => {
      const result = await dispatch(removeFromWishlistAction(wishlistItemId));
      if (removeFromWishlistAction.fulfilled.match(result)) {
        dispatch(
          showSuccessToast(
            productName
              ? `${productName} removed from wishlist`
              : 'Removed from wishlist'
          )
        );
        return true;
      } else {
        dispatch(showErrorToast('Failed to remove from wishlist'));
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Remove item from wishlist by product ID
   */
  const removeByProductId = useCallback(
    async (productId: number, productName?: string) => {
      const result = await dispatch(removeFromWishlistByProductId(productId));
      if (removeFromWishlistByProductId.fulfilled.match(result)) {
        dispatch(
          showSuccessToast(
            productName
              ? `${productName} removed from wishlist`
              : 'Removed from wishlist'
          )
        );
        return true;
      } else {
        dispatch(showErrorToast('Failed to remove from wishlist'));
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Toggle product in wishlist
   */
  const toggleWishlist = useCallback(
    async (productId: number, productName?: string) => {
      const wishlistItem = items.find((item) => item.productId === productId);

      if (wishlistItem) {
        return await removeFromWishlist(wishlistItem.id, productName);
      } else {
        return await addToWishlist(productId, productName);
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  /**
   * Check if product is in wishlist
   */
  const isInWishlist = useCallback(
    (productId: number): boolean => {
      return items.some((item) => item.productId === productId);
    },
    [items]
  );

  /**
   * Get wishlist item by product ID
   */
  const getWishlistItem = useCallback(
    (productId: number) => {
      return items.find((item) => item.productId === productId);
    },
    [items]
  );

  /**
   * Get wishlist count
   */
  const count = items.length;

  // Auto-load wishlist on mount if authenticated
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  return {
    items,
    count,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    removeByProductId,
    toggleWishlist,
    isInWishlist,
    getWishlistItem,
    loadWishlist,
  };
};

export default useWishlist;
