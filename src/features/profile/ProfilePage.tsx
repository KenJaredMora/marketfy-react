// src/features/profile/ProfilePage.tsx
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAppSelector } from '../../app/store/hooks';
import { selectCurrentUser } from '../../app/store/selectors';
import { usersService } from '../../core/api/services';
import { useToast } from '../../core/hooks';
import type { UpdateUserDto } from '../../core/types';

const schema = yup
  .object({
    displayName: yup.string().min(3).max(50).required('Display name is required'),
    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    bio: yup.string().max(500, 'Bio must be at most 500 characters').optional(),
  })
  .required();

const ProfilePage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UpdateUserDto>({
    // Cast to any so TS doesn’t try to force Yup’s inferred type to match UpdateUserDto exactly
    resolver: yupResolver(schema) as any,
    defaultValues: {
      displayName: user?.displayName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
    },
  });

  const bioValue = watch('bio') || '';

  const onSubmit: SubmitHandler<UpdateUserDto> = async (data) => {
    try {
      await usersService.updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="info">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          My Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            value={user.email}
            disabled
            margin="normal"
            helperText="Email cannot be changed"
          />

          <TextField
            fullWidth
            label="Display Name"
            {...register('displayName')}
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
            margin="normal"
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                {...register('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                margin="normal"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                {...register('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                margin="normal"
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            {...register('bio')}
            error={!!errors.bio}
            helperText={`${bioValue.length}/500 characters`}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
          >
            Update Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
