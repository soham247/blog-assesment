import { createTRPCRouter } from './trpc';
import { postsRouter } from './routers/posts';
import { categoriesRouter } from './routers/categories';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  categories: categoriesRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;