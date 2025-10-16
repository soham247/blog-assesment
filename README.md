# DevBlog - Professional Blog Platform

A modern, full-stack blog application built with Next.js 15, tRPC, Drizzle ORM, and PostgreSQL. This application demonstrates best practices in modern web development with full type safety from client to server.

## 🚀 Features

### ✅ Implemented (Core Features - Priority 1)
- ✅ **Blog post CRUD operations** (create, read, update, delete)
- ✅ **Category CRUD operations**
- ✅ **Assign multiple categories to posts**
- ✅ **Blog listing page** showing all published posts
- ✅ **Individual post view page**
- ✅ **Category filtering** on listing page
- ✅ **Professional navigation** with responsive design
- ✅ **Clean, modern UI** built with shadcn/ui components

### ✅ Implemented (Expected Features - Priority 2)
- ✅ **Landing page** with Hero, Features, and CTA sections
- ✅ **Dashboard for managing posts and categories**
- ✅ **Draft vs Published** post status system
- ✅ **Loading and error states** with skeleton components
- ✅ **Mobile-responsive design** with Tailwind CSS
- ✅ **Content rendering** with markdown support and syntax highlighting

### ✅ Implemented (Bonus Features - Priority 3)
- ✅ **Full 5-section landing page** (Header, Hero, Features, CTA, Footer)
- ✅ **Search functionality** for posts and categories
- ✅ **Advanced Post Editor** with markdown support, live preview, and category management
- ✅ **Post preview functionality**

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: tRPC with Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Zustand + React Query (via tRPC)
- **Content**: Markdown rendering with syntax highlighting
- **Deployment Ready**: Vercel, Docker, or any Node.js hosting

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud service like Supabase/Neon)
- Git for version control

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd blog
npm install
```

### 2. Environment Setup

Copy the environment template and configure your database:

```bash
cp .env.example .env.local
```

Update `.env.local` with your database URL:

```bash
# Database Configuration (Required)
DATABASE_URL=""

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 3. Database Setup

Push the database schema and seed with sample data:

```bash
# Push database schema
npm run db:push

# Seed with sample blog posts and categories
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/trpc/[trpc]/   # tRPC API routes
│   ├── blog/              # Blog listing and post pages
│   ├── dashboard/         # Admin dashboard (in progress)
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── providers/        # Context providers
│   ├── navigation.tsx    # Main navigation
│   └── blog-post-card.tsx # Post preview cards
├── server/               # tRPC server configuration
│   ├── routers/         # API route handlers
│   ├── trpc.ts          # tRPC setup
│   └── index.ts         # Main router
├── db/                  # Database configuration
│   ├── schema.ts        # Drizzle ORM schema
│   └── index.ts         # Database client
├── lib/                 # Utility functions
├── store/               # Zustand state management
└── scripts/             # Database seeding scripts
```

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
```

**Built with ❤️ using modern web technologies for optimal developer experience and performance.**
