# BrightEyes — B2B Digital Optical Supply & Wholesale Platform (Phase 1)

BrightEyes Phase 1 is a dedicated B2B digital optical supply and wholesale platform connecting optical wholesalers/suppliers with optical retail stores across Cambodia.

---

## 1. Project Overview

The platform enables optical retailers in Cambodia to browse wholesale optical products (eyeglass frames, sunglasses, contact lenses, single vision & progressive optical lenses, accessories, and optometric machinery), verify real-time stock levels, add items to a shopping cart, and submit B2B orders directly to suppliers.

### Core Business Flow
```
Wholesaler / Supplier
        ↓
Products & Live Stock Inventory
        ↓
Retail Store
        ↓
Browse & Filter Catalog (Real-Time Stock)
        ↓
Add Products to Cart
        ↓
Create B2B Order (Prisma Transaction Stock Reservation)
        ↓
Wholesaler Accepts & Processes Order (Status Machine)
        ↓
Delivery / Pickup
        ↓
Retailer Inventory Ledger Updated
```

---

## 2. Technology Stack

* **Backend Framework**: NestJS (TypeScript, REST API)
* **ORM & Database**: Prisma ORM, PostgreSQL (`glass_db`)
* **Security & Auth**: JWT (Access Token 15m + Refresh Token 7d), bcrypt password hashing, Passport.js, Helmet, CORS
* **Validation & OpenAPI**: `class-validator`, `class-transformer`, Swagger / OpenAPI (`/api/docs`)
* **Frontend Framework**: Vue 3 (Composition API), TypeScript, Vite
* **State & Routing**: Pinia, Vue Router (Role-Based Navigation Guards)
* **Styling & UI**: Tailwind CSS v4, Lucide Icons, Glassmorphic Optical Design Tokens
* **HTTP Client**: Axios with automatic Bearer Token injection & 401 token refresh interceptors
* **Containerization**: Docker, Docker Compose

---

## 3. Project Structure

```
brighteyes/
├── backend/
│   ├── src/
│   │   ├── admin/         # Super Admin platform overview & user management
│   │   ├── auth/          # JWT auth, register, login, refresh, me
│   │   ├── cart/          # Shopping cart with DB price validation
│   │   ├── categories/    # Product categories CRUD
│   │   ├── common/        # Decorators, guards, filters, interceptors
│   │   ├── delivery/      # Logistics & tracking model
│   │   ├── inventory/     # Live stock calculation & retailer ledger
│   │   ├── orders/        # Transactional B2B order state machine
│   │   ├── products/      # Product CRUD, search & filtering
│   │   ├── prisma/        # Global Prisma service
│   │   ├── retailers/     # Retailer store profiles
│   │   ├── wholesalers/   # Wholesaler company profiles
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma  # Normalized PostgreSQL relational schema
│   │   └── seed.ts        # Cambodian optical seed data
│   ├── test/              # E2E integration test suite
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── assets/        # Tailwind main.css & glassmorphic design system
│   │   ├── components/    # Common UI, StockBadges, OrderStatusBadges, StatCards
│   │   ├── layouts/       # AuthLayout, AdminLayout, WholesalerLayout, RetailerLayout
│   │   ├── pages/         # Auth, Admin, Wholesaler, & Retailer Views
│   │   ├── router/        # Vue Router with RBAC guards
│   │   ├── services/      # Axios REST API services
│   │   ├── stores/        # Pinia stores (auth, product, cart, order)
│   │   └── types/         # TypeScript interfaces
│   ├── Dockerfile
│   ├── package.json
│   └── .env
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 4. Environment Variables Setup

### Backend Environment (`backend/.env`)
```env
DATABASE_URL="postgresql://brighteyes:brighteyes_password@localhost:5433/glass_db?schema=public"
PORT=3000
JWT_SECRET="super_secret_brighteyes_jwt_access_key_2026"
JWT_REFRESH_SECRET="super_secret_brighteyes_jwt_refresh_key_2026"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

### Frontend Environment (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 5. Quick Start & Execution

### 1. Database & Prisma Setup
```bash
# Navigate to backend
cd backend

# Generate Prisma Client
npx prisma generate

# Sync Database Schema with PostgreSQL glass_db
npx prisma db push

# Seed Realistic Cambodian Optical Business Data
npx prisma db seed
```

### 2. Start Backend Server
```bash
cd backend
npm run start:dev
# NestJS REST API: http://localhost:3000/api
# Swagger API Docs: http://localhost:3000/api/docs
```

### 3. Start Frontend Web Application
```bash
cd Frontend
npm run dev
# Vue 3 App: http://localhost:5173
```

---

## 6. Docker Desktop Setup

To run the entire stack using Docker Compose:
```bash
docker-compose up --build -d
```
* **PostgreSQL Database**: `localhost:5432` (`glass_db`)
* **NestJS Backend**: `http://localhost:3000`
* **Vue 3 Frontend**: `http://localhost:5173`

---

## 7. Automated E2E Integration Testing

To run the comprehensive backend test suite testing auth, RBAC, live stock reservation, cart validation, order creation, and stock updates:
```bash
cd backend
npm run test:e2e
```

---

## 8. Default Pre-Configured Development Accounts

| Role | Email Address | Password | Description / Account Name |
|---|---|---|---|
| **Super Admin** | `admin@brighteyes.com` | `password123` | System Administrator |
| **Wholesaler 1** | `wholesaler1@brighteyes.com` | `password123` | Sokha Optical Supply Co., Ltd |
| **Wholesaler 2** | `wholesaler2@brighteyes.com` | `password123` | Angkor Vision & Lens Wholesale |
| **Retailer 1** | `retailer1@brighteyes.com` | `password123` | Phnom Penh Eyewear Center |
| **Retailer 2** | `retailer2@brighteyes.com` | `password123` | Siem Reap Vision Care Clinic |
| **Retailer 3** | `retailer3@brighteyes.com` | `password123` | Battambang Optical House |
| **Retailer 4** | `retailer4@brighteyes.com` | `password123` | Sihanoukville Bright Vision Shop |
| **Retailer 5** | `retailer5@brighteyes.com` | `password123` | Kampot Optics & Style Store |
