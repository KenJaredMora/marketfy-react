// Product Types
export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  tags?: string[];
  description?: string;
  stock?: number;
}

/* export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} */
export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}


// Cart Types
export interface CartItem {
  product: Product;
  qty: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  userId: number;
  productId: number;
  createdAt: string;
  product: Product;
}

// Order Types
export interface OrderItem {
  product: Product;
  qty: number;
  // price?: number; // if we ever decide to store price per item
}

export interface Order {
  orderId: string;
  userId: number;
  items: OrderItem[];
  total: number;
  status?: string;
  createdAt: string;
  updatedAt: string;

  // Optional / derived fields (frontend only)
  subtotal?: number;
  shipping?: number;
  discount?: number;
  shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  shippingMethod: 'standard' | 'express' | 'overnight';
  promoCode?: string;
}

// User Types
export interface User {
  id: number;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests: string[];
}

export interface UpdateUserDto {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
}

export interface AuthResponse {
  access_token: string;
  userId: number;
  user?: User;
}

// API Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProductSearchParams extends PaginationParams {
  q?: string;
  tag?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ToastMessage {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
