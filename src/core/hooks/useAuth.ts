import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import {
  login as loginAction,
  register as registerAction,
  logout as logoutAction,
  fetchCurrentUser,
} from '../../app/store/slices/authSlice';
import { clearWishlist } from '../../app/store/slices/wishlistSlice';
import { clearOrders } from '../../app/store/slices/ordersSlice';
import {
  selectIsAuthenticated,
  selectCurrentUser,
  selectAuthLoading,
  selectAuthError,
} from '../../app/store/selectors';
import { LoginCredentials, RegisterData } from '../types';

/**
 * Custom hook for authentication operations
 * Implements Single Responsibility Principle - handles only auth-related logic
 *
 * @returns Authentication state and operations
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginAction(credentials));
      if (loginAction.fulfilled.match(result)) {
        // Fetch user profile after successful login
        await dispatch(fetchCurrentUser());
        navigate('/products');
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerAction(data));
      if (registerAction.fulfilled.match(result)) {
        // Fetch user profile after successful registration
        await dispatch(fetchCurrentUser());
        navigate('/products');
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  /**
   * Logout user and clear all data
   */
  const logout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(clearWishlist());
    dispatch(clearOrders());
    navigate('/auth');
  }, [dispatch, navigate]);

  /**
   * Load user profile
   */
  const loadUser = useCallback(async () => {
    if (isAuthenticated && !user) {
      await dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);

  // Auto-load user on mount if authenticated but user data is missing
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
  };
};

export default useAuth;
