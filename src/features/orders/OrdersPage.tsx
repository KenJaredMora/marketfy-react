import { Receipt, Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { selectOrdersList } from '../../app/store/selectors';
import { fetchOrders } from '../../app/store/slices/ordersSlice';
import { formatCurrency, formatDate } from '../../core/utils';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // ✅ Ensure orders is ALWAYS an array
  const ordersRaw = useAppSelector(selectOrdersList);
  const orders = Array.isArray(ordersRaw) ? ordersRaw : [];

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) =>
    (order.orderId ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Empty orders screen
  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Receipt sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          No orders yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Start shopping to see your orders here
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/products')}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Order History
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by Order ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ my: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredOrders.map((order) => (
          <Grid key={order.orderId} size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">Order #{order.orderId}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary">
                    {formatCurrency(order.total)}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {order.items?.length ?? 0} item(s) • Status: {order.status || 'Processing'}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => navigate(`/orders/${order.orderId}`)}
                  sx={{ mt: 2 }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrdersPage;
