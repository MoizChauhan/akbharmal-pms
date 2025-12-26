# AK Bharmal Management Website

A comprehensive ERP system for glass and aluminum windows manufacturing.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database**: PostgreSQL with Prisma ORM (v7)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Auth**: NextAuth.js
- **Notifications**: Sonner

## Features
- **Dashboard**: Real-time analytics and revenue trends.
- **Client Management**: Full CRUD for clients and order history.
- **Order System**:
  - Dynamic pricing (auto-saves new masters).
  - Aluminum manufacturing formulas.
  - Labor tracking.
  - Multi-unit size display (inch/feet).
- **Workshop**: Production workflow with item-level status tracking.
- **CMS**: Master data management for materials.
- **UAM**: Per-user module access control.
- **Accounts**: Tracking ready-to-dispatch orders.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Create a `.env` file based on `.env.example` and add your `DATABASE_URL`.
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

3. **Run Design System (Optional)**:
   The project uses shadcn/ui. You can add more components using `npx shadcn@latest add`.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Manufacturing Formula
The system automatically calculates aluminum component sizes:
- **Bearing**: (Width - offset) / 2
- **Handle**: Height - offset
- **Glass Width**: Bearing + offset
- **Glass Height**: Handle - offset

These offsets are configurable per build type in the CMS.
Best App
