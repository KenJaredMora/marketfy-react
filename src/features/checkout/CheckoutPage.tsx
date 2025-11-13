import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAppDispatch } from '../../app/store/hooks';
import { createOrder } from '../../app/store/slices/ordersSlice';
import { ordersService } from '../../core/api/services';
import { useCart } from '../../core/hooks';
import type { CheckoutFormData } from '../../core/types';
import { formatCurrency } from '../../core/utils';

const schema = yup
  .object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    address: yup.string().required('Address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup
      .string()
      .required('ZIP code is required')
      .matches(/^\d{5}$/, 'Invalid ZIP code'),
    country: yup.string().required('Country is required'),
    phone: yup.string().required('Phone is required'),
    shippingMethod: yup
      .string()
      .oneOf(['standard', 'express', 'overnight'])
      .required('Shipping method is required'),
    promoCode: yup.string().optional(),
  })
  .required();

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    // Cast to any so TS stops trying to reconcile yup's inferred type
    resolver: yupResolver(schema) as any,
    defaultValues: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      phone: '',
      shippingMethod: 'standard',
      promoCode: '',
    },
  });

  const shippingMethod = watch('shippingMethod') || 'standard';
  const promoCode = watch('promoCode');

  const shipping = ordersService.calculateShipping(
    shippingMethod as 'standard' | 'express' | 'overnight'
  );
  const discount = promoCode ? ordersService.applyPromoCode(promoCode, total) : 0;
  const finalTotal = total + shipping - discount;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = ordersService.prepareOrderData(items, data, finalTotal);
      await dispatch(createOrder(orderData)).unwrap();
      clearCart();
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Checkout
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...register('fullName')}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="City"
                    {...register('city')}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="State"
                    {...register('state')}
                    error={!!errors.state}
                    helperText={errors.state?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    {...register('zipCode')}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Country"
                    {...register('country')}
                    error={!!errors.country}
                    helperText={errors.country?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    {...register('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Shipping Method
                  </Typography>
                  <RadioGroup>
                    <FormControlLabel
                      value="standard"
                      control={<Radio {...register('shippingMethod')} />}
                      label={`Standard Shipping - ${formatCurrency(
                        5.99
                      )} (5-7 business days)`}
                    />
                    <FormControlLabel
                      value="express"
                      control={<Radio {...register('shippingMethod')} />}
                      label={`Express Shipping - ${formatCurrency(
                        12.99
                      )} (2-3 business days)`}
                    />
                    <FormControlLabel
                      value="overnight"
                      control={<Radio {...register('shippingMethod')} />}
                      label={`Overnight Shipping - ${formatCurrency(
                        24.99
                      )} (1 business day)`}
                    />
                  </RadioGroup>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Promo Code (Optional)"
                    {...register('promoCode')}
                    helperText="Try: SAVE10, SAVE20, FIRSTORDER"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Place Order'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />

            {items.map((item) => (
              <Box key={item.product.id} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {item.product.name} x {item.qty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatCurrency(item.product.price * item.qty)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(total)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>{formatCurrency(shipping)}</Typography>
            </Box>
            {discount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="success.main">Discount:</Typography>
                <Typography color="success.main">
                  -{formatCurrency(discount)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(finalTotal)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
