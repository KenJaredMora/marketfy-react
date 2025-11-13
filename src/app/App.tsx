import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import theme from '../theme/theme';
import Navbar from '../shared/components/Navbar';
import ToastContainer from '../shared/components/ToastContainer';
import LoadingSpinner from '../shared/components/LoadingSpinner';
import ProtectedRoute from '../core/guards/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectGlobalLoading } from './store/selectors';
import { apiClient } from '../core/api/apiClient';
import { setGlobalLoading } from './store/slices/uiSlice';
import { showErrorToast } from './store/slices/uiSlice';

// Lazy load pages for code splitting
const ProductsPage = React.lazy(() => import('../features/products/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('../features/products/ProductDetailPage'));
const AuthPage = React.lazy(() => import('../features/auth/AuthPage'));
const CartPage = React.lazy(() => import('../features/cart/CartPage'));
const WishlistPage = React.lazy(() => import('../features/wishlist/WishlistPage'));
const CheckoutPage = React.lazy(() => import('../features/checkout/CheckoutPage'));
const OrdersPage = React.lazy(() => import('../features/orders/OrdersPage'));
const OrderDetailPage = React.lazy(() => import('../features/orders/OrderDetailPage'));
const ProfilePage = React.lazy(() => import('../features/profile/ProfilePage'));

/**
 * Main App Component
 * Configures routing, theme, and global providers
 * Implements code splitting with lazy loading
 */
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isGlobalLoading = useAppSelector(selectGlobalLoading);

  // Configure API client callbacks
  useEffect(() => {
    apiClient.setLoadingCallback((loading: boolean) => {
      dispatch(setGlobalLoading(loading));
    });

    apiClient.setErrorCallback((error: string) => {
      dispatch(showErrorToast(error));
    });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />

          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
            <React.Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Protected Routes */}
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/products" replace />} />
              </Routes>
            </React.Suspense>
          </Box>

          {/* Global Loading Indicator */}
          {isGlobalLoading && <LoadingSpinner fullScreen message="Loading..." />}

          {/* Toast Notifications */}
          <ToastContainer />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
