import { Delete, Favorite, ShoppingCart } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardMedia, Container, Typography, Grid2 as Grid } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useWishlist } from '../../core/hooks';
import { formatCurrency } from '../../core/utils';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your wishlist is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Add products you love to your wishlist
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/products')}>
          Discover Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Wishlist ({items.length} items)
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.product.imageUrl || `https://via.placeholder.com/200?text=${encodeURIComponent(item.product.name)}`}
                alt={item.product.name}
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/products/${item.product.id}`)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {item.product.name}
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(item.product.price)}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  onClick={() => addToCart(item.product)}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => removeFromWishlist(item.id, item.product.name)}
                >
                  <Delete />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WishlistPage;