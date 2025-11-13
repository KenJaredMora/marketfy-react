import { Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import {
  selectProductsError,
  selectProductsList,
  selectProductsLoading,
  selectProductsPagination,
} from '../../app/store/selectors';
import { fetchProducts, setPage } from '../../app/store/slices/productsSlice';
import { useDebounce } from '../../core/hooks';
import ProductCard from './components/ProductCard';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  // ✅ Normalize products to an empty array if selector returns undefined/null
  const productsFromStore = useAppSelector(selectProductsList);
  const products = productsFromStore ?? [];

  // ✅ Add safe defaults for pagination fields
  const pagination = useAppSelector(selectProductsPagination);
  const page = pagination?.page ?? 1;
  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? products.length;

  const isLoading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 12, q: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    dispatch(setPage(1)); // Reset to first page on search
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Products
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Discover amazing products from our collection
      </Typography>

      <Box sx={{ my: 3 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading && products.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {products.length} of {total} products
          </Typography>

          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductsPage;
