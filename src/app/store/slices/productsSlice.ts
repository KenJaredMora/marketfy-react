import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { productsService } from '../../../core/api/services';
import type { Product, ProductSearchParams, ProductsResponse } from '../../../core/types';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  searchQuery: string;
  selectedTag: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  total: 0,
  page: 1,
  limit: 12,
  totalPages: 0,
  searchQuery: '',
  selectedTag: '',
  isLoading: false,
  error: null,
};

/**
 * Async thunk for fetching products
 */
export const fetchProducts = createAsyncThunk<ProductsResponse, ProductSearchParams | void>(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsService.getProducts(params || undefined);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);

/**
 * Async thunk for fetching single product
 */
export const fetchProductById = createAsyncThunk<Product, number>(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const product = await productsService.getProductById(id);
      return product;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch product');
    }
  }
);

/**
 * Async thunk for searching products
 */
export const searchProducts = createAsyncThunk<
  ProductsResponse,
  { query: string; page?: number; limit?: number }
>(
  'products/searchProducts',
  async ({ query, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await productsService.searchProducts(query, page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search products');
    }
  }
);

/**
 * Products Slice
 * Manages product catalog state
 */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Set search query
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    /**
     * Set selected tag filter
     */
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    /**
     * Set current page
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    /**
     * Reset filters
     */
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedTag = '';
      state.page = 1;
    },
    /**
     * Clear current product
     */
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;

        // Backend returns { items, total, page, limit }
        state.products = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;

        // Calculate totalPages
        state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Product By ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search Products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;

        state.products = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;

        state.totalPages = Math.ceil(action.payload.total / action.payload.limit);
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedTag,
  setPage,
  resetFilters,
  clearCurrentProduct,
  clearError,
} = productsSlice.actions;

export default productsSlice.reducer;
