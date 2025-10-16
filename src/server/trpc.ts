import { initTRPC } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { ZodError } from 'zod';
import superjson from 'superjson';

import { db } from '@/db';

export const createTRPCContext = (opts: FetchCreateContextFnOptions) => {
  const { req } = opts;

  return {
    db,
    req,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});


export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;