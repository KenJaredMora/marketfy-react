import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { wishlistService } from '../../../core/api/services';
import type { WishlistItem } from '../../../core/types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

/**
 * Async thunk for fetching wishlist
 */
export const fetchWishlist = createAsyncThunk<WishlistItem[]>(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const items = await wishlistService.getWishlist();
      return items;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

/**
 * Async thunk for adding to wishlist
 */
export const addToWishlist = createAsyncThunk<WishlistItem, number>(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const item = await wishlistService.addToWishlist(productId);
      return item;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

/**
 * Async thunk for removing from wishlist
 */
export const removeFromWishlist = createAsyncThunk<number, number>(
  'wishlist/removeFromWishlist',
  async (wishlistItemId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(wishlistItemId);
      return wishlistItemId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

/**
 * Async thunk for removing from wishlist by product ID
 */
export const removeFromWishlistByProductId = createAsyncThunk<number, number>(
  'wishlist/removeFromWishlistByProductId',
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistService.removeByProductId(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

/**
 * Wishlist Slice
 * Manages wishlist state with backend synchronization
 */
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    /**
     * Clear wishlist (for logout)
     */
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from Wishlist by Product ID
    builder
      .addCase(removeFromWishlistByProductId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlistByProductId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          (item) => item.productId !== action.payload
        );
      })
      .addCase(removeFromWishlistByProductId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
