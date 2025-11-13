import { ArrowBack, Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Typography,
  Grid2 as Grid,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { selectCurrentProduct, selectProductsError, selectProductsLoading } from '../../app/store/selectors';
import { fetchProductById } from '../../app/store/slices/productsSlice';
import { useAuth, useCart, useWishlist } from '../../core/hooks';
import { formatCurrency } from '../../core/utils';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = useAppSelector(selectCurrentProduct);
  const isLoading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Product not found'}</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/products')} sx={{ mb: 3 }}>
        Back to Products
      </Button>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            <img
              src={product.imageUrl || `https://via.placeholder.com/600?text=${encodeURIComponent(product.name)}`}
              alt={product.name}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {product.name}
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
            {formatCurrency(product.price)}
          </Typography>

          <Box sx={{ my: 2 }}>
            {product.tags?.map((tag) => (
              <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>

          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            {product.description || 'No description available for this product.'}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => addToCart(product)}
              sx={{ flexGrow: 1 }}
            >
              Add to Cart
            </Button>

            {isAuthenticated && (
              <IconButton
                size="large"
                onClick={() => toggleWishlist(product.id, product.name)}
                color={inWishlist ? 'error' : 'default'}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                {inWishlist ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;