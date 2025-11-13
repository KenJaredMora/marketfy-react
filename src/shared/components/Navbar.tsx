import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Person,
  Menu as MenuIcon,
  Receipt,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart, useWishlist } from '../../core/hooks';

/**
 * Navbar Component
 * Top navigation bar with cart/wishlist badges and user menu
 * Responsive design with mobile drawer
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleUserMenuClose();
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { label: 'Products', path: '/products', show: true },
    { label: 'Cart', path: '/cart', show: true, badge: itemCount },
    { label: 'Wishlist', path: '/wishlist', show: isAuthenticated, badge: wishlistCount },
    { label: 'Orders', path: '/orders', show: isAuthenticated },
    { label: 'Profile', path: '/profile', show: isAuthenticated },
  ];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem>
          <Typography variant="h6" color="primary">
            Marketfy
          </Typography>
        </ListItem>
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemText primary={item.label} />
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge badgeContent={item.badge} color="primary" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        {!isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/auth')}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="primary"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              color: 'primary.main',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/products')}
          >
            Marketfy
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button color="primary" onClick={() => navigate('/products')}>
                Products
              </Button>

              <IconButton color="primary" onClick={() => navigate('/cart')}>
                <Badge badgeContent={itemCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {isAuthenticated && (
                <>
                  <IconButton color="primary" onClick={() => navigate('/wishlist')}>
                    <Badge badgeContent={wishlistCount} color="error">
                      <Favorite />
                    </Badge>
                  </IconButton>

                  <IconButton color="primary" onClick={handleUserMenuOpen}>
                    <Person />
                  </IconButton>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleUserMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" color="text.secondary">
                        {user?.displayName || user?.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                      <Person sx={{ mr: 1 }} fontSize="small" />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/orders')}>
                      <Receipt sx={{ mr: 1 }} fontSize="small" />
                      Orders
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1 }} fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}

              {!isAuthenticated && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
