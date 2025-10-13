import { z } from 'zod';
import { eq, desc, count, not } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '../trpc';
import { categoriesTable, postCategoriesTable, postsTable } from '@/db';
import { generateSlug, generateUniqueSlug } from '@/lib/slug';

const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
});

const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required').max(255).optional(),
  description: z.string().optional(),
});

export const categoriesRouter = createTRPCRouter({
  // Get all categories with post count
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const categories = await ctx.db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
          description: categoriesTable.description,
          createdAt: categoriesTable.createdAt,
          updatedAt: categoriesTable.updatedAt,
        })
        .from(categoriesTable)
        .orderBy(desc(categoriesTable.name));
      // console.log('====================================');
      // console.log(categories);
      // console.log('====================================');
      // Get post count for each category
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const postCountResult = await ctx.db
            .select({ count: count() })
            .from(postCategoriesTable)
            .innerJoin(postsTable, eq(postCategoriesTable.postId, postsTable.id))
            .where(eq(postCategoriesTable.categoryId, category.id));
          
          return {
            ...category,
            postCount: postCountResult[0]?.count ?? 0,
          };
        })
      );
      // console.log('====================================');
      // console.log(categoriesWithCount);
      // console.log('====================================');
      return categoriesWithCount;
    }),

  // Get single category by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.slug, input.slug))
        .limit(1);

      if (!category[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Get post count for this category
      const postCountResult = await ctx.db
        .select({ count: count() })
        .from(postCategoriesTable)
        .innerJoin(postsTable, eq(postCategoriesTable.postId, postsTable.id))
        .where(eq(postCategoriesTable.categoryId, category[0].id));

      return {
        ...category[0],
        postCount: postCountResult[0]?.count ?? 0,
      };
    }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, input.id))
        .limit(1);

      if (!category[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Get post count for this category
      const postCountResult = await ctx.db
        .select({ count: count() })
        .from(postCategoriesTable)
        .innerJoin(postsTable, eq(postCategoriesTable.postId, postsTable.id))
        .where(eq(postCategoriesTable.categoryId, category[0].id));

      return {
        ...category[0],
        postCount: postCountResult[0]?.count ?? 0,
      };
    }),

  // Create new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;
      
      // Generate slug
      const baseSlug = generateSlug(name);
      const existingSlugs = (await ctx.db.select({ slug: categoriesTable.slug }).from(categoriesTable))
        .map(c => c.slug);
      const slug = generateUniqueSlug(baseSlug, existingSlugs);

      // Create category
      const newCategory = await ctx.db
        .insert(categoriesTable)
        .values({
          name,
          slug,
          description,
        })
        .returning();

      return newCategory[0];
    }),

  // Update category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if category exists
      const existingCategory = await ctx.db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, id))
        .limit(1);

      if (!existingCategory[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      const updatedData: Partial<typeof categoriesTable.$inferInsert> = { ...updateData };

      // Update slug if name is changing
      if (updateData.name) {
        const baseSlug = generateSlug(updateData.name);
        // Fetch all existing slugs except the current category's slug
        const existingSlugs = (
          await ctx.db
            .select({ slug: categoriesTable.slug })
            .from(categoriesTable)
            .where(not(eq(categoriesTable.id, id)))
        ).map((c) => c.slug);

        updatedData.slug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      // Update category
      const updatedCategory = await ctx.db
        .update(categoriesTable)
        .set({ ...updatedData, updatedAt: new Date() })
        .where(eq(categoriesTable.id, id))
        .returning();

      return updatedCategory[0];
    }),

  // Delete category
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if category exists
      const existingCategory = await ctx.db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, input.id))
        .limit(1);

      if (!existingCategory[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Check if category has posts
      const postCountResult = await ctx.db
        .select({ count: count() })
        .from(postCategoriesTable)
        .where(eq(postCategoriesTable.categoryId, input.id));

      if (postCountResult[0]?.count && postCountResult[0].count > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot delete category that has posts. Please remove all posts from this category first.',
        });
      }

      // Delete category
      await ctx.db
        .delete(categoriesTable)
        .where(eq(categoriesTable.id, input.id));

      return { success: true };
    }),
});