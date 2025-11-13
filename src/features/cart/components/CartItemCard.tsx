import { Add, Delete, Remove } from '@mui/icons-material';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import React from 'react';
import { useCart } from '../../../core/hooks';
import type { CartItem } from '../../../core/types';
import { formatCurrency } from '../../../core/utils';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 150, objectFit: 'cover' }}
        image={item.product.imageUrl || `https://via.placeholder.com/150?text=${encodeURIComponent(item.product.name)}`}
        alt={item.product.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h6">{item.product.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {item.product.description}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            {formatCurrency(item.product.price)}
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" onClick={() => decreaseQuantity(item.product.id)}>
              <Remove />
            </IconButton>
            <Typography sx={{ minWidth: 30, textAlign: 'center' }}>{item.qty}</Typography>
            <IconButton size="small" onClick={() => increaseQuantity(item.product.id)}>
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(item.product.price * item.qty)}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => removeFromCart(item.product.id)}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default CartItemCard;
