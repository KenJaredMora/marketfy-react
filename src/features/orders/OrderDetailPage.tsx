import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Container, Divider, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { selectCurrentOrder } from '../../app/store/selectors';
import { fetchOrderById } from '../../app/store/slices/ordersSlice';
import { formatCurrency, formatDateTime } from '../../core/utils';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectCurrentOrder);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (!order) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography>Order not found</Typography>
        <Button onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  // 🔹 Backend only guarantees: items, total, createdAt, etc.
  // Safely derive what we can on the frontend.
  const shippingAddress = order.shippingAddress; // may be undefined

  const items = order.items ?? [];

  const computedSubtotal = items.reduce((sum, item) => {
    const unitPrice = item.product?.price ?? 0;
    return sum + unitPrice * item.qty;
  }, 0);

  const subtotal = order.subtotal ?? computedSubtotal;
  const shipping = order.shipping ?? Math.max(order.total - subtotal, 0);
  const discount = order.discount ?? 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mb: 3 }}>
        Back to Orders
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Order #{order.orderId}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Placed on {formatDateTime(order.createdAt)}
        </Typography>

        {/* 🔹 Only show shipping/contact if we actually have it */}
        {shippingAddress && (
          <>
            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  SHIPPING ADDRESS
                </Typography>
                <Typography>{shippingAddress.fullName}</Typography>
                <Typography>{shippingAddress.address}</Typography>
                <Typography>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                </Typography>
                <Typography>{shippingAddress.country}</Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  CONTACT
                </Typography>
                <Typography>{shippingAddress.email}</Typography>
                <Typography>{shippingAddress.phone}</Typography>
              </Grid>
            </Grid>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>

        {items.map((item, index) => {
          const unitPrice = item.product?.price ?? 0;
          const lineTotal = unitPrice * item.qty;

          return (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography>{item.product?.name ?? 'Product'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {item.qty} × {formatCurrency(unitPrice)}
                </Typography>
              </Box>
              <Typography fontWeight="bold">{formatCurrency(lineTotal)}</Typography>
            </Box>
          );
        })}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>{formatCurrency(subtotal)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Shipping:</Typography>
          <Typography>{formatCurrency(shipping)}</Typography>
        </Box>
        {discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="success.main">Discount:</Typography>
            <Typography color="success.main">-{formatCurrency(discount)}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">
            {formatCurrency(order.total)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderDetailPage;
