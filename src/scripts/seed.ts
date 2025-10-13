import 'dotenv/config';
import { db, categoriesTable, postsTable, postCategoriesTable } from '../db';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create categories
    console.log('Creating categories...');
    const categories = await db.insert(categoriesTable).values([
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Articles about modern web development technologies and practices',
      },
      {
        name: 'React',
        slug: 'react',
        description: 'Everything about React and its ecosystem',
      },
      {
        name: 'Next.js',
        slug: 'nextjs',
        description: 'Next.js tutorials, tips, and best practices',
      },
      {
        name: 'TypeScript',
        slug: 'typescript',
        description: 'Type-safe JavaScript development with TypeScript',
      },
      {
        name: 'Database',
        slug: 'database',
        description: 'Database design, optimization, and best practices',
      },
      {
        name: 'DevOps',
        slug: 'devops',
        description: 'Deployment, CI/CD, and infrastructure topics',
      },
    ]).returning();

    console.log(`✅ Created ${categories.length} categories`);

    // Create posts
    console.log('Creating blog posts...');
    const posts = await db.insert(postsTable).values([
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-with-nextjs-15',
        content: `# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements that make building React applications even better. In this comprehensive guide, we'll explore the key features and how to get started.

## What's New in Next.js 15?

### 1. App Router Stable
The App Router is now stable and is the recommended way to build Next.js applications. It provides:
- Better performance with React Server Components
- Improved developer experience
- More intuitive file-based routing

### 2. Improved Performance
Next.js 15 includes several performance improvements:
- Faster builds
- Better tree-shaking
- Optimized bundle sizes

### 3. Enhanced Developer Experience
- Better error messages
- Improved TypeScript support
- Enhanced debugging tools

## Getting Started

To create a new Next.js 15 project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## App Router Structure

The new App Router uses a different file structure:

\`\`\`
app/
  layout.tsx
  page.tsx
  blog/
    page.tsx
    [slug]/
      page.tsx
\`\`\`

## Conclusion

Next.js 15 is a significant release that makes React development more enjoyable and productive. The stable App Router, performance improvements, and enhanced developer experience make it a great choice for your next project.`,
        excerpt: 'Explore the new features and improvements in Next.js 15, including the stable App Router, performance enhancements, and better developer experience.',
        status: 'published',
        publishedAt: new Date('2024-01-15'),
      },
      {
        title: 'Building Type-Safe APIs with tRPC',
        slug: 'building-type-safe-apis-with-trpc',
        content: `# Building Type-Safe APIs with tRPC

tRPC is a fantastic library that allows you to build fully type-safe APIs without schema or code generation. In this post, we'll explore how to set up and use tRPC effectively.

## What is tRPC?

tRPC stands for TypeScript Remote Procedure Call. It's a library that allows you to build APIs with full type safety from client to server.

### Key Benefits:
- **Full type safety**: From client to server
- **No code generation**: Types are inferred automatically
- **Great DX**: Excellent developer experience with IntelliSense
- **Framework agnostic**: Works with any framework

## Setting Up tRPC

### 1. Installation

\`\`\`bash
npm install @trpc/server @trpc/client @trpc/react-query
npm install @tanstack/react-query
\`\`\`

### 2. Server Setup

Create your tRPC router:

\`\`\`typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUsers: t.procedure.query(async () => {
    // Fetch users from database
    return users;
  }),
  
  createUser: t.procedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      // Create user in database
      return newUser;
    }),
});

export type AppRouter = typeof appRouter;
\`\`\`

### 3. Client Setup

Set up the client:

\`\`\`typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './server';

export const trpc = createTRPCReact<AppRouter>();
\`\`\`

## Using tRPC in Components

\`\`\`tsx
function UserList() {
  const { data: users, isLoading } = trpc.getUsers.useQuery();
  const createUser = trpc.createUser.useMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
\`\`\`

## Conclusion

tRPC provides an excellent developer experience for building type-safe APIs. The automatic type inference and great tooling make it a joy to work with.`,
        excerpt: 'Learn how to build fully type-safe APIs using tRPC, with automatic type inference and excellent developer experience.',
        status: 'published',
        publishedAt: new Date('2024-01-10'),
      },
      {
        title: 'Modern Database Design with Drizzle ORM',
        slug: 'modern-database-design-with-drizzle-orm',
        content: `# Modern Database Design with Drizzle ORM

Drizzle ORM is a lightweight and performant TypeScript ORM that provides a great developer experience. Let's explore how to use it effectively.

## Why Drizzle ORM?

### Key Features:
- **Type-safe**: Full TypeScript support
- **Performance**: Minimal overhead
- **SQL-like**: Familiar query syntax
- **Migration system**: Easy schema management

## Getting Started

### Installation

\`\`\`bash
npm install drizzle-orm drizzle-kit
npm install postgres  # for PostgreSQL
\`\`\`

### Schema Definition

\`\`\`typescript
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});
\`\`\`

### Database Connection

\`\`\`typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(DATABASE_URL);
export const db = drizzle(client);
\`\`\`

## Querying Data

### Basic Queries

\`\`\`typescript
// Select all users
const users = await db.select().from(usersTable);

// Select with conditions
const user = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, 1));

// Insert data
const newUser = await db
  .insert(usersTable)
  .values({
    name: 'John Doe',
    email: 'john@example.com',
  })
  .returning();
\`\`\`

### Relationships

\`\`\`typescript
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  userId: integer('user_id').references(() => users.id),
});

// Join queries
const usersWithPosts = await db
  .select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.userId));
\`\`\`

## Migration System

Drizzle Kit provides a powerful migration system:

\`\`\`bash
# Generate migrations
npx drizzle-kit generate:pg

# Push to database
npx drizzle-kit push:pg
\`\`\`

## Best Practices

1. **Use transactions for complex operations**
2. **Index frequently queried columns**
3. **Use prepared statements for repeated queries**
4. **Validate input data with Zod**

## Conclusion

Drizzle ORM provides a modern, type-safe way to work with databases in TypeScript. Its lightweight design and excellent developer experience make it a great choice for new projects.`,
        excerpt: 'Discover how to use Drizzle ORM for modern, type-safe database operations with excellent performance and developer experience.',
        status: 'published',
        publishedAt: new Date('2024-01-05'),
      },
      {
        title: 'Advanced React Patterns and Best Practices',
        slug: 'advanced-react-patterns-and-best-practices',
        content: `# Advanced React Patterns and Best Practices

React has evolved significantly over the years. Let's explore some advanced patterns and best practices that can help you build better React applications.

## Component Composition Patterns

### 1. Compound Components

\`\`\`tsx
// Instead of props drilling
<Modal size="large" hasHeader={true} hasFooter={true}>
  <ModalHeader>Title</ModalHeader>
  <ModalBody>Content</ModalBody>
  <ModalFooter>Actions</ModalFooter>
</Modal>
\`\`\`

### 2. Render Props Pattern

\`\`\`tsx
function DataFetcher({ children, url }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ... fetch logic

  return children({ data, loading });
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
</DataFetcher>
\`\`\`

## Custom Hooks for Logic Reuse

### useLocalStorage Hook

\`\`\`tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
\`\`\`

## State Management Patterns

### 1. useReducer for Complex State

\`\`\`tsx
interface State {
  users: User[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
\`\`\`

### 2. Context + useReducer Pattern

\`\`\`tsx
const UserContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within UserProvider');
  }
  return context;
}
\`\`\`

## Performance Optimization

### 1. Memoization

\`\`\`tsx
// useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// useCallback for function references
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// React.memo for component memoization
const UserCard = React.memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>;
});
\`\`\`

### 2. Code Splitting

\`\`\`tsx
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## Error Handling

### Error Boundaries

\`\`\`tsx
class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}
\`\`\`

## Testing Best Practices

### 1. Testing Components

\`\`\`tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('should handle user input', async () => {
  const user = userEvent.setup();
  const mockOnSubmit = jest.fn();
  
  render(<ContactForm onSubmit={mockOnSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John Doe' });
});
\`\`\`

### 2. Testing Custom Hooks

\`\`\`tsx
import { renderHook, act } from '@testing-library/react';

test('useCounter should increment', () => {
  const { result } = renderHook(() => useCounter());
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
\`\`\`

## Conclusion

These advanced patterns and practices can help you build more maintainable, performant, and reliable React applications. Remember to choose the right pattern for your specific use case.`,
        excerpt: 'Explore advanced React patterns including compound components, custom hooks, state management, and performance optimization techniques.',
        status: 'published',
        publishedAt: new Date('2023-12-20'),
      },
      {
        title: 'Deploying Full-Stack Applications to Production',
        slug: 'deploying-full-stack-applications-to-production',
        content: `# Deploying Full-Stack Applications to Production

Deploying full-stack applications can be complex. This guide covers best practices and strategies for deploying modern web applications to production.

## Deployment Strategies

### 1. Static Site Deployment (Vercel/Netlify)

For Next.js applications with static generation:

\`\`\`bash
# Build for production
npm run build

# Vercel deployment
npx vercel --prod

# Netlify deployment
npm run build && netlify deploy --prod --dir=.next
\`\`\`

### 2. Container Deployment (Docker)

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### 3. Serverless Deployment

\`\`\`yaml
# vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/app/api/$1"
    }
  ]
}
\`\`\`

## Database Deployment

### 1. Production Database Setup

Use managed database services:
- **PostgreSQL**: Neon, Supabase, Amazon RDS
- **MongoDB**: MongoDB Atlas
- **MySQL**: PlanetScale, Amazon RDS

### 2. Migration Strategy

\`\`\`bash
# Run migrations on deployment
npm run db:migrate:prod

# Seed initial data if needed
npm run db:seed:prod
\`\`\`

## Environment Configuration

### Production Environment Variables

\`\`\`bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
\`\`\`

### Environment Validation

\`\`\`typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
});

export const env = envSchema.parse(process.env);
\`\`\`

## CI/CD Pipeline

### GitHub Actions Example

\`\`\`yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`

## Performance Optimization

### 1. Bundle Optimization

\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
\`\`\`

### 2. Caching Strategy

\`\`\`typescript
// API routes caching
export async function GET() {
  const data = await fetchData();
  
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  });
}
\`\`\`

## Monitoring and Logging

### 1. Error Tracking

\`\`\`typescript
// Install Sentry
npm install @sentry/nextjs

// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
\`\`\`

### 2. Performance Monitoring

\`\`\`typescript
// Analytics tracking
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
\`\`\`

## Security Best Practices

### 1. Security Headers

\`\`\`javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
\`\`\`

### 2. Rate Limiting

\`\`\`typescript
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const identifier = getClientIP(request);
  
  try {
    await rateLimit.check(identifier, 5, '1 m'); // 5 requests per minute
  } catch {
    return new Response('Rate limit exceeded', { status: 429 });
  }
  
  // Process request
}
\`\`\`

## Conclusion

Deploying to production requires careful planning and consideration of many factors. This guide covers the essential aspects of production deployment, from build optimization to monitoring and security.`,
        excerpt: 'A comprehensive guide to deploying full-stack applications to production, covering deployment strategies, CI/CD, performance optimization, and security.',
        status: 'published',
        publishedAt: new Date('2023-12-15'),
      },
      {
        title: 'Draft: Understanding Server-Side Rendering',
        slug: 'understanding-server-side-rendering',
        content: `# Understanding Server-Side Rendering

This is a draft post about SSR concepts and implementation...

## What is SSR?

Server-Side Rendering (SSR) is a technique where HTML is generated on the server...

*This post is still being written...*`,
        excerpt: 'An in-depth look at server-side rendering concepts and implementation strategies.',
        status: 'draft',
      },
    ]).returning();

    console.log(`✅ Created ${posts.length} posts`);

    // Create post-category relationships
    console.log('Creating post-category relationships...');
    const postCategories = await db.insert(postCategoriesTable).values([
      // Next.js post
      { postId: posts[0].id, categoryId: categories[2].id }, // Next.js
      { postId: posts[0].id, categoryId: categories[0].id }, // Web Development
      
      // tRPC post
      { postId: posts[1].id, categoryId: categories[0].id }, // Web Development
      { postId: posts[1].id, categoryId: categories[3].id }, // TypeScript
      
      // Drizzle ORM post
      { postId: posts[2].id, categoryId: categories[4].id }, // Database
      { postId: posts[2].id, categoryId: categories[3].id }, // TypeScript
      
      // React patterns post
      { postId: posts[3].id, categoryId: categories[1].id }, // React
      { postId: posts[3].id, categoryId: categories[0].id }, // Web Development
      
      // Deployment post
      { postId: posts[4].id, categoryId: categories[5].id }, // DevOps
      { postId: posts[4].id, categoryId: categories[0].id }, // Web Development
      
      // Draft SSR post
      { postId: posts[5].id, categoryId: categories[0].id }, // Web Development
      { postId: posts[5].id, categoryId: categories[1].id }, // React
    ]).returning();

    console.log(`✅ Created ${postCategories.length} post-category relationships`);

    console.log('🎉 Database seeded successfully!');
    console.log(`
📊 Summary:
- ${categories.length} categories created
- ${posts.length} posts created (${posts.filter(p => p.status === 'published').length} published, ${posts.filter(p => p.status === 'draft').length} draft)
- ${postCategories.length} post-category relationships created
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed script
if (require.main === module) {
  seed()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(() => {
      console.log('👋 Seeding completed');
      process.exit(0);
    });
}