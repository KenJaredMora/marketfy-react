// src/features/auth/components/RegisterForm.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, CircularProgress, Grid, TextField } from '@mui/material';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../../../core/hooks';
import type { RegisterData } from '../../../core/types';

const schema = yup
  .object({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    displayName: yup
      .string()
      .min(3, 'Display name must be at least 3 characters')
      .required('Display name is required'),
    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    bio: yup.string().max(500, 'Bio must be at most 500 characters').optional(),
  })
  .required();

const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    // Cast resolver to any so TS doesn’t force Yup’s internal type
    resolver: yupResolver(schema) as any,
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
      firstName: '',
      lastName: '',
      bio: '',
      interests: [],
    },
  });

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    await registerUser(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        type="email"
        autoComplete="email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        margin="normal"
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label="Display Name"
        {...register('displayName')}
        error={!!errors.displayName}
        helperText={errors.displayName?.message}
        margin="normal"
        disabled={isLoading}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="First Name (Optional)"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            margin="normal"
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Last Name (Optional)"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            margin="normal"
            disabled={isLoading}
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        label="Password"
        type="password"
        autoComplete="new-password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        margin="normal"
        disabled={isLoading}
      />

      <TextField
        fullWidth
        label="Bio (Optional)"
        multiline
        rows={3}
        {...register('bio')}
        error={!!errors.bio}
        helperText={errors.bio?.message || 'Max 500 characters'}
        margin="normal"
        disabled={isLoading}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        sx={{ mt: 3 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
    </Box>
  );
};

export default RegisterForm;
