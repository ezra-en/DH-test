# eCommerce Checkout System

A full-stack eCommerce checkout application built with Next.js frontend and Hono backend, featuring JWT authentication, cart management, and Stripe payment integration.

## 🚀 Features

- **Authentication**: JWT-based login with hardcoded test credentials
- **Product Catalog**: Browse curated tech products
- **Shopping Cart**: Add, update, remove items with real-time updates
- **Stripe Checkout**: Secure payment processing with redirect flow
- **Responsive Design**: Mobile-first UI with clean, modern interface
- **Real-time Feedback**: Toast notifications and loading states

## 🛠️ Tech Stack

### Backend
- **Hono** - Fast, lightweight web framework
- **Drizzle ORM** - Type-safe database operations
- **SQLite** - Database with Bun's native driver
- **Stripe** - Payment processing
- **Jose** - Modern JWT handling
- **Bun** - Native password hashing and blazing fast runtime 😂

### Frontend
- **Next.js 15** - React framework with App Router
- **Shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first styling
- **Sonner** - Toast notifications

## 📁 Project Structure

```
ecommerce-checkout/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Main API server
│   │   ├── auth.ts           # JWT & password utilities
│   │   ├── middleware.ts     # Authentication middleware
│   │   ├── db.ts             # Database connection & seeding
│   │   └── schema.ts         # Drizzle database schema
│   ├── package.json
│   ├── .env.example
│   └── database.sqlite       # Auto-generated
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities & API calls
│   ├── package.json
│   └── .env.local.example
└── README.md
```

## ⚡ Quick Setup

### Prerequisites
- [Bun](https://bun.sh/) installed
- [Stripe Test Account](https://dashboard.stripe.com/test) (optional - test keys provided)

### 🚀 One-Command Setup (Recommended)
```bash
git clone https://github.com/ezra-en/DH-test/
cd ecommerce-checkout

# Install dependencies + migrate database + seed data
bun run setup

# Start both frontend and backend
bun run dev
```

### Manual Setup
```bash
git clone https://github.com/ezra-en/DH-test/
cd ecommerce-checkout

# Install backend dependencies
cd backend
bun install

# Install frontend dependencies
cd ../frontend
bun install

# Run database migration
cd ../backend
bun run migrate
```

### 2. Environment Setup

### Backend (.env):
**Note**: Stripe test keys are already configured but you can replace them with your own:
```bash
cd backend
cp .env.example .env
# Edit .env with your Stripe secret key (optional - test keys provided)
```

**Frontend (.env.local):**
```bash
cd frontend
cp .env.local.example .env.local
# Edit .env.local with your Stripe publishable key (optional - test keys provided)
```

### 3. Start Development Servers

**One Command (Workspace):**
```bash
# Starts both backend (3001) and frontend (3000)
bun run dev
```

**Manual:**
```bash
# Terminal 1 - Backend (port 3001)
cd backend
bun run dev

# Terminal 2 - Frontend (port 3000)
cd frontend
bun run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

## 🔧 Workspace Commands

This project uses Bun workspaces for unified dependency management:

```bash
# Install dependencies + migrate database + seed data
bun run setup

# Start both servers concurrently
bun run dev

# Run database migration only
bun run migrate

# Build both projects
bun run build

# Start production servers
bun run start

# Clean all node_modules
bun run clean

# Reset everything (clean + delete DB + setup)
bun run reset
```

## 🔐 Test Credentials

### Login
- **Email**: `test@example.com`
- **Password**: `password123`

### Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)

## 📊 API Endpoints

**📁 Insomnia Collection**: Import the Insomnia collection at `Insomnia.yaml` for pre-configured API requests with authentication.

### Authentication
- `POST /api/login` - User authentication

### Products
- `GET /api/products` - Get all products

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PATCH /api/cart/update` - Update item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Checkout (Protected)
- `POST /api/checkout/create-session` - Create Stripe checkout session

## 🎯 User Journey

1. **Browse Products**: View tech products without authentication
2. **Sign In**: Use test credentials to access cart functionality
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: View cart sidebar, update quantities, remove items
5. **Checkout**: Click "Checkout" → Redirects to Stripe
6. **Payment**: Complete payment with test card
7. **Success**: Return to success page, cart automatically clears

## 🏗️ Architecture Decisions

### Why Hono?
- Lightweight and fast
- Excellent TypeScript support
- Modern API design
- Edge runtime compatible

### Why Drizzle?
- Type-safe database operations
- Safer than raw SQL
- Excellent developer experience
- Perfect for SQLite

### Why Native Bun APIs?
- Fewer external dependencies for common operations
- Optimised password hashing
- Built-in SQLite support
- Reduced bundle size


## 🚧 Production Considerations

### Security
- [ ] Change JWT secret in production
- [ ] Use real Stripe keys
- [ ] Add rate limiting
- [ ] Implement proper error logging
- [ ] Add input validation middleware

### Database
- [ ] Consider PostgreSQL for production (RLS)
- [ ] Implement connection pooling
- [ ] Add backup strategy

### Deployment
- [ ] Configure environment variables
- [ ] Set up CI/CD pipeline
- [ ] Add health checks
- [ ] Configure monitoring

## 📝 Commit History

This project was written with feature-specific commits as requested:
- Initial project setup
- Database schema and seeding
- Authentication implementation
- Cart functionality
- Stripe integration
- UI/UX improvements
- Mobile responsiveness
- Final documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for assessment purposes.

---

**Assessment completed in approximately 3 hours**
