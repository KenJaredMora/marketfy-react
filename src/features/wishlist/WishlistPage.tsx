import { Delete, Favorite, ShoppingCart } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useWishlist } from '../../core/hooks';
import { formatCurrency } from '../../core/utils';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Empty state
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
      {/* Header - similar to ProductsPage */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Wishlist
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} {items.length === 1 ? 'item saved' : 'items saved'}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="medium"
          onClick={() => navigate('/products')}
        >
          Browse more products
        </Button>
      </Box>

      {/* Grid = same breakpoints as ProductsPage */}
      <Grid container spacing={3}>
        {items.map((item) => {
          // Normalize product so we never crash if backend omits it
          const product = item.product ?? {
            id: item.productId,
            name: 'Unknown product',
            price: 0,
            imageUrl: '',
          };

          return (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    product.imageUrl ||
                    `https://via.placeholder.com/400x300?text=${encodeURIComponent(
                      product.name,
                    )}`
                  }
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minHeight: '24px',
                    }}
                  >
                    {/* Wishlist has no description, keep it simple */}
                    Saved for later
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mt: 2, fontWeight: 'bold' }}
                  >
                    {formatCurrency(product.price)}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{
                    justifyContent: 'space-between',
                    px: 300,
                    pb: 2,
                    pt: 0,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add to Cart
                  </Button>

                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.id, product.name);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default WishlistPage;
