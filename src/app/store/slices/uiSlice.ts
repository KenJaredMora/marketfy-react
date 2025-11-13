import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ToastMessage } from '../../../core/types';
import { generateId } from '../../../core/utils';

interface UIState {
  isGlobalLoading: boolean;
  toasts: ToastMessage[];
  sidebarOpen: boolean;
}

const initialState: UIState = {
  isGlobalLoading: false,
  toasts: [],
  sidebarOpen: false,
};

/**
 * UI Slice
 * Manages global UI state (loading, toasts, sidebars, etc.)
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Show global loading indicator
     */
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.isGlobalLoading = action.payload;
    },
    /**
     * Add toast notification
     */
    addToast: (
      state,
      action: PayloadAction<Omit<ToastMessage, 'id'>>
    ) => {
      const toast: ToastMessage = {
        id: generateId(),
        ...action.payload,
        duration: action.payload.duration || 5000,
      };
      state.toasts.push(toast);
    },
    /**
     * Remove toast notification by ID
     */
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    /**
     * Clear all toasts
     */
    clearToasts: (state) => {
      state.toasts = [];
    },
    /**
     * Show success toast
     */
    showSuccessToast: (state, action: PayloadAction<string>) => {
      const toast: ToastMessage = {
        id: generateId(),
        message: action.payload,
        severity: 'success',
        duration: 5000,
      };
      state.toasts.push(toast);
    },
    /**
     * Show error toast
     */
    showErrorToast: (state, action: PayloadAction<string>) => {
      const toast: ToastMessage = {
        id: generateId(),
        message: action.payload,
        severity: 'error',
        duration: 5000,
      };
      state.toasts.push(toast);
    },
    /**
     * Show warning toast
     */
    showWarningToast: (state, action: PayloadAction<string>) => {
      const toast: ToastMessage = {
        id: generateId(),
        message: action.payload,
        severity: 'warning',
        duration: 5000,
      };
      state.toasts.push(toast);
    },
    /**
     * Show info toast
     */
    showInfoToast: (state, action: PayloadAction<string>) => {
      const toast: ToastMessage = {
        id: generateId(),
        message: action.payload,
        severity: 'info',
        duration: 5000,
      };
      state.toasts.push(toast);
    },
    /**
     * Toggle sidebar
     */
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    /**
     * Set sidebar state
     */
    setSidebar: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setGlobalLoading,
  addToast,
  removeToast,
  clearToasts,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  toggleSidebar,
  setSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;
