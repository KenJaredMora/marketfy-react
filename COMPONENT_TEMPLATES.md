# Component Implementation Templates

This file provides templates for implementing all remaining components. Copy these templates and customize them for your needs.

## Products Page Template

```tsx
// src/features/products/ProductsPage.tsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, Box, Typography, TextField, Pagination } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { fetchProducts, setSearchQuery, setPage } from '../../app/store/slices/productsSlice';
import { selectProductsList, selectProductsPagination, selectProductsLoading } from '../../app/store/selectors';
import ProductCard from './components/ProductCard';
import LoadingSpinner from '../../shared/components/LoadingSpinner';
import { useDebounce } from '../../core/hooks';

const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProductsList);
  const { page, totalPages } = useAppSelector(selectProductsPagination);
  const isLoading = useAppSelector(selectProductsLoading);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 12, q: debouncedSearch }));
  }, [page, debouncedSearch, dispatch]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setPage(value));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <TextField
        fullWidth
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
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
          />
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage;
```

## Product Card Template

```tsx
// src/features/products/components/ProductCard.tsx
import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Button, Box } from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../../core/types';
import { useCart, useWishlist } from '../../../core/hooks';
import { formatCurrency } from '../../../core/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id, product.name);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={product.imageUrl || 'https://via.placeholder.com/200'}
        alt={product.name}
        sx={{ objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => navigate(`/products/${product.id}`)}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          {formatCurrency(product.price)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          size="small"
        >
          Add to Cart
        </Button>
        <IconButton onClick={handleToggleWishlist} color={inWishlist ? 'error' : 'default'}>
          {inWishlist ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
```

## Auth Page Template

```tsx
// src/features/auth/AuthPage.tsx
import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box } from '@mui/material';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const AuthPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tab === 0 ? <LoginForm /> : <RegisterForm />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
```

## Login Form Template

```tsx
// src/features/auth/components/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../../../core/hooks';
import { LoginCredentials } from '../../../core/types';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    await login(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        fullWidth
        label="Email"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        margin="normal"
      />

      <TextField
        fullWidth
        type="password"
        label="Password"
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
        margin="normal"
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={isLoading}
        sx={{ mt: 3 }}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};

export default LoginForm;
```

## Cart Page Template

```tsx
// src/features/cart/CartPage.tsx
import React from 'react';
import { Container, Typography, Button, Box, Paper, Divider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../core/hooks';
import CartItem from './components/CartItem';
import { formatCurrency } from '../../core/utils';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({itemCount} items)
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Subtotal:</Typography>
              <Typography>{formatCurrency(total)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" sx={{ mb: 3 }}>
              Total: {formatCurrency(total)}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
```

## Additional Pages

Follow similar patterns for:
- **WishlistPage.tsx** - Similar to CartPage but uses wishlist hook
- **CheckoutPage.tsx** - Multi-step form with react-hook-form
- **OrdersPage.tsx** - List orders from Redux store
- **OrderDetailPage.tsx** - Show single order details
- **ProfilePage.tsx** - Editable user profile form
- **ProductDetailPage.tsx** - Full product details with add to cart/wishlist

## Key Patterns to Follow

### 1. Component Structure
```tsx
// Imports
import React from 'react';
import { Material-UI components } from '@mui/material';
import { hooks } from 'core/hooks';

// Props interface
interface ComponentProps {
  prop: Type;
}

// Component
const Component: React.FC<ComponentProps> = ({ prop }) => {
  // Hooks
  // State
  // Handlers
  // Effects

  return (
    // JSX
  );
};

export default Component;
```

### 2. Form Validation
Always use react-hook-form + yup for forms.

### 3. Loading States
Show LoadingSpinner during async operations.

### 4. Error Handling
Display errors using Alert or Toast.

### 5. Responsive Design
Use Material-UI Grid and breakpoints.

### 6. TypeScript
Always type props, state, and function returns.

## Testing Template

```tsx
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../../app/store';
import ComponentName from './ComponentName';

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ComponentName />
      </BrowserRouter>
    </Provider>
  );
};

describe('ComponentName', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    renderComponent();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // Assertions
  });
});
```

## Implementation Checklist

- [ ] Create all page components
- [ ] Implement forms with validation
- [ ] Add loading states
- [ ] Handle errors gracefully
- [ ] Make responsive
- [ ] Add PropTypes/TypeScript types
- [ ] Write tests
- [ ] Add accessibility (ARIA labels)
- [ ] Optimize performance (React.memo, useMemo)
- [ ] Add documentation comments

## Next Steps

1. Copy templates above
2. Customize for your features
3. Connect to Redux hooks
4. Test thoroughly
5. Optimize and refactor

