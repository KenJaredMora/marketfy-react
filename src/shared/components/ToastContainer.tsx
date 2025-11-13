import type { AlertColor } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { selectToasts } from '../../app/store/selectors';
import { removeToast } from '../../app/store/slices/uiSlice';

/**
 * ToastContainer Component
 * Displays toast notifications from Redux store
 * Automatically removes toasts after specified duration
 */
const ToastContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);

  const handleClose = (toastId: string) => {
    dispatch(removeToast(toastId));
  };

  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => handleClose(toast.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            bottom: { xs: 16, sm: 24 + index * 70 },
          }}
        >
          <Alert
            onClose={() => handleClose(toast.id)}
            severity={toast.severity as AlertColor}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default ToastContainer;
