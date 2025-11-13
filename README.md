# Marketfy React

A modern, full-featured e-commerce platform built with React, TypeScript, Redux Toolkit, and Material-UI. This is a complete React implementation migrated from Angular, following best practices, clean code principles, and SOLID design patterns.

## 🚀 Quick Start

```bash
# 1. Start the backend API (in angular-project/marketfy-api)
cd ../angular-project/marketfy-api
npm install
npm run start:dev

# 2. Start the React app
cd marketfy-react
npm run dev
```

The app will run at <http://localhost:5173>

## 🎯 Demo Credentials

```md
Email: demo@marketfy.test
Password: password123
```

## ✨ Features

- ✅ Authentication (JWT-based)
- ✅ Product catalog with search & pagination
- ✅ Shopping cart with localStorage
- ✅ Wishlist (backend-synced)
- ✅ Checkout process
- ✅ Order history
- ✅ User profile management
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Protected routes

## 📖 Documentation

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Complete project overview and architecture
- **[COMPONENT_TEMPLATES.md](./COMPONENT_TEMPLATES.md)** - Copy-paste templates for all components

## 🛠️ Tech Stack

- React 18 + TypeScript
- Redux Toolkit (state management)
- React Router v6 (routing)
- Material-UI (components)
- Axios (HTTP client)
- React Hook Form + Yup (forms)
- Vitest (testing)
- Vite (build tool)

## 📁 Project Structure

```md
src/
├── app/                # App configuration
│   ├── store/         # Redux store
│   └── App.tsx        # Main component
├── core/              # Core functionality
│   ├── api/          # API services
│   ├── hooks/        # Custom hooks
│   ├── types/        # TypeScript types
│   └── utils/        # Utilities
├── features/          # Feature modules
│   ├── auth/
│   ├── cart/
│   ├── products/
│   ├── wishlist/
│   ├── orders/
│   └── profile/
├── shared/            # Shared components
└── theme/             # Material-UI theme
```

## 🎨 Architecture Highlights

### ✅ Completed Infrastructure (100%)

- Redux store with slices for all features
- API client with interceptors
- Custom hooks (useAuth, useCart, useWishlist, etc.)
- Protected routes & authentication guards
- Responsive Navbar with badges
- Loading spinner & toast notifications
- Material-UI theme configuration
- Type-safe TypeScript throughout

### 🔄 Next: Implement Features

Use the templates in **COMPONENT_TEMPLATES.md** to build:

1. Authentication pages (Login/Register)
2. Products page with search
3. Cart & Wishlist pages
4. Checkout form
5. Orders history
6. User profile

## 🧪 Testing

```bash
npm run test          # Run tests
npm run test:ui       # Run with UI
npm run test:coverage # Coverage report
```

## 🏗️ Build

```bash
npm run build   # Build for production
npm run preview # Preview build
```

## 🔑 Environment Variables

Create/edit `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## 📚 API Endpoints

**Base**: `http://localhost:3000`

### Public

- `GET /products` - List products
- `POST /auth/login` - Login
- `POST /auth/register` - Register

### Protected (require JWT token)

- `GET /wishlist` - Get wishlist
- `POST /orders` - Create order
- `GET /orders` - Order history
- `PATCH /users/me` - Update profile

## 🎓 Learning Path

1. Review **IMPLEMENTATION_GUIDE.md** for architecture overview
2. Study the core infrastructure in `src/core/` and `src/app/store/`
3. Use **COMPONENT_TEMPLATES.md** to implement features
4. Test your components as you build
5. Follow the milestones in the requirements

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |

## 🎯 Best Practices Applied

- **SOLID Principles** - Single responsibility, dependency inversion
- **Clean Code** - Descriptive names, small functions, proper typing
- **React Patterns** - Custom hooks, component composition, memoization
- **Redux Best Practices** - Normalized state, async thunks, selectors
- **Type Safety** - Full TypeScript coverage, no `any` types

## 📱 Responsive Design

- Mobile-first approach
- Material-UI breakpoints
- Touch-friendly interfaces
- Responsive navigation

## 🐛 Troubleshooting

**Backend not connecting?**

- Check backend is running on port 3000
- Verify `.env` has correct API_URL

**Build errors?**

- Clear cache: `rm -rf node_modules && npm install`

**TypeScript errors?**

- Restart TypeScript server in VS Code

---

**Ready to code?** I recommend you to use/open **COMPONENT_TEMPLATES.md** and start building! 🚀
