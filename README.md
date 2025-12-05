# Shopify Analytics Dashboard

A comprehensive multi-tenant analytics dashboard for Shopify stores built with Next.js 15, featuring real-time insights, revenue tracking, and customer analytics.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Turso](https://img.shields.io/badge/Turso-SQLite-green)
![Better Auth](https://img.shields.io/badge/Better_Auth-Latest-purple)

## 🚀 Features

- **Multi-Tenant Architecture**: Complete data isolation per tenant with secure, scalable infrastructure
- **Real-Time Analytics**: Track revenue, orders, and customer metrics with interactive charts
- **Secure Authentication**: Enterprise-grade security with Better Auth and encrypted data storage
- **High Performance**: Optimized queries with pagination, filtering, and efficient data loading
- **Rich Visualizations**: Beautiful charts powered by Recharts for data insights
- **RESTful API**: Complete API with filtering, pagination, and comprehensive documentation

## 📋 Tech Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: Turso (SQLite)
- **Authentication**: Better Auth
- **Charts**: Recharts
- **Language**: TypeScript

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Client    │ ───> │  API Layer   │ ───> │   Database   │
│  Next.js    │      │  Next.js     │      │    Turso     │
└─────────────┘      └──────────────┘      └──────────────┘
```

### Multi-Tenant Design

- **Tenant Isolation**: All data access requires a `tenantId` parameter
- **Data Structure**: Tenants → Customers, Products, Orders (via foreign keys)
- **Security**: Row-level security through query filters

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Turso account (free tier available)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd shopify-analytics-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment variables are already configured** in `.env`:
   ```env
   TURSO_CONNECTION_URL=<configured>
   TURSO_AUTH_TOKEN=<configured>
   BETTER_AUTH_SECRET=<configured>
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### Tables

- **tenants**: Store information (id, name, shopifyDomain, shopifyAccessToken)
- **customers**: Customer data (id, tenantId, email, firstName, lastName, totalSpent, ordersCount)
- **products**: Product catalog (id, tenantId, title, price, inventory)
- **orders**: Order history (id, tenantId, customerId, totalPrice, status, orderDate)
- **user, session, account, verification**: Authentication tables (Better Auth)

### Sample Data

The database is pre-seeded with:
- 3 tenants: "Acme Store", "Fashion Boutique", "Tech Gadgets"
- 150 customers (50 per tenant)
- 90 products (30 per tenant)
- 600 orders (200 per tenant) spread over 12 months

## 🔌 API Endpoints

### Tenants
- `GET /api/tenants` - List all tenants
- `GET /api/tenants?id=[id]` - Get single tenant
- `POST /api/tenants` - Create tenant
- `PUT /api/tenants?id=[id]` - Update tenant
- `DELETE /api/tenants?id=[id]` - Delete tenant

### Customers
- `GET /api/customers?tenantId=[id]` - List customers (required: tenantId)
- `POST /api/customers` - Create customer
- `PUT /api/customers?id=[id]` - Update customer
- `DELETE /api/customers?id=[id]` - Delete customer

### Orders
- `GET /api/orders?tenantId=[id]` - List orders (required: tenantId)
- `POST /api/orders` - Create order
- `PUT /api/orders?id=[id]` - Update order
- `DELETE /api/orders?id=[id]` - Delete order

### Products
- `GET /api/products?tenantId=[id]` - List products (required: tenantId)
- `POST /api/products` - Create product
- `PUT /api/products?id=[id]` - Update product
- `DELETE /api/products?id=[id]` - Delete product

Full API documentation available at `/documentation` after login.

## 🔐 Authentication

The application uses Better Auth for authentication:

1. **Register**: Create an account at `/register`
2. **Login**: Sign in at `/login`
3. **Protected Routes**: `/dashboard`, `/documentation` require authentication

### Test Accounts

Create your own account via the registration page. No pre-configured test accounts.

## 📈 Dashboard Features

- **Metrics Cards**: Total revenue, orders, customers, and average order value
- **Date Range Filtering**: Last 30 days, 90 days, or 12 months
- **Revenue Trends**: Line chart showing monthly revenue over time
- **Order Status Distribution**: Bar chart of orders by status
- **Top Customers**: Table of top 5 customers by total spend
- **Tenant Switching**: View data for different Shopify stores

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Required Environment Variables

```env
TURSO_CONNECTION_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
BETTER_AUTH_SECRET=your_secret_key
```

## 🛠️ Development

### Project Structure

```
shopify-analytics-dashboard/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard page
│   │   ├── documentation/    # Documentation page
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   └── DashboardLayout.tsx
│   ├── db/
│   │   ├── index.ts          # Database client
│   │   ├── schema.ts         # Database schema
│   │   └── seeds/            # Database seeders
│   └── lib/
│       ├── auth.ts           # Auth server
│       └── auth-client.ts    # Auth client
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Key Assumptions

1. Each tenant represents a separate Shopify store
2. Data syncs handled via API ingestion (webhook support planned)
3. SQLite (Turso) provides sufficient scalability for MVP
4. Authentication is per-platform, not per-tenant (admin access)
5. All monetary values in USD

## 🎯 Production Roadmap

### Phase 1: Core Infrastructure ✅
- Multi-tenant database architecture
- Authentication system
- RESTful API with pagination
- Dashboard with analytics

### Phase 2: Shopify Integration (Planned)
- OAuth flow for store connection
- Webhook handlers for real-time sync
- Initial data import via Admin API
- Webhook signature verification

### Phase 3: Performance & Scale (Planned)
- Redis caching
- Database indexing optimization
- CDN for static assets
- API response compression

### Phase 4: Security & Compliance (Planned)
- Role-based access control (RBAC)
- API key management
- Audit logging
- GDPR compliance

### Phase 5: Enhanced Features (Planned)
- Advanced analytics (cohort analysis, LTV)
- Email alerts
- Custom reports
- Data export (CSV, PDF, Excel)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Visit `/documentation` in the app
- **Issues**: Open an issue on GitHub
- **Email**: Contact support team

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Turso](https://turso.tech/) - SQLite database
- [Better Auth](https://better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Recharts](https://recharts.org/) - Chart library

---

**Status**: Production Ready ✅

Built with ❤️ using Next.js and Turso