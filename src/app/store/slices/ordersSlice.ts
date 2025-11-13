import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersService, CreateOrderDto } from '../../../core/api/services/ordersService';
import { Order } from '../../../core/types';

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  lastCreatedOrderId: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  lastCreatedOrderId: null,
};

/**
 * Async thunk for creating order
 */
export const createOrder = createAsyncThunk<Order, CreateOrderDto>(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const order = await ordersService.createOrder(orderData);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

/**
 * Async thunk for fetching orders
 */
export const fetchOrders = createAsyncThunk<
  Order[],
  { page?: number; limit?: number } | void
>(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const orders = await ordersService.getOrders(params?.page, params?.limit);
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

/**
 * Async thunk for fetching single order
 */
export const fetchOrderById = createAsyncThunk<Order, string>(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const order = await ordersService.getOrderById(orderId);
      return order;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

/**
 * Async thunk for searching orders
 */
export const searchOrders = createAsyncThunk<Order[], string>(
  'orders/searchOrders',
  async (query, { rejectWithValue }) => {
    try {
      const orders = await ordersService.searchOrders(query);
      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search orders');
    }
  }
);

/**
 * Orders Slice
 * Manages order state and history
 */
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    /**
     * Clear current order
     */
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Clear orders (for logout)
     */
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.lastCreatedOrderId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload); // Add to beginning
        state.lastCreatedOrderId = action.payload.orderId;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Order By ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Search Orders
    builder
      .addCase(searchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(searchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearError, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
