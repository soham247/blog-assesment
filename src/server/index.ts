import { createTRPCRouter } from './trpc';
import { postsRouter } from './routers/posts';
import { categoriesRouter } from './routers/categories';

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  categories: categoriesRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;