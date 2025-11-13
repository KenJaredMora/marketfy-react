import { useCallback } from 'react';
import { useAppDispatch } from '../../app/store/hooks';
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
} from '../../app/store/slices/uiSlice';

/**
 * Custom hook for toast notifications
 * Provides convenient methods for showing different types of toasts
 *
 * @returns Toast notification methods
 */
export const useToast = () => {
  const dispatch = useAppDispatch();

  const success = useCallback(
    (message: string) => {
      dispatch(showSuccessToast(message));
    },
    [dispatch]
  );

  const error = useCallback(
    (message: string) => {
      dispatch(showErrorToast(message));
    },
    [dispatch]
  );

  const warning = useCallback(
    (message: string) => {
      dispatch(showWarningToast(message));
    },
    [dispatch]
  );

  const info = useCallback(
    (message: string) => {
      dispatch(showInfoToast(message));
    },
    [dispatch]
  );

  return {
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
