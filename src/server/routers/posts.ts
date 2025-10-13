import { z } from 'zod';
import { eq, desc, and, inArray, like, or, count, not } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

import { createTRPCRouter, publicProcedure } from '../trpc';
import { postsTable, categoriesTable, postCategoriesTable } from '@/db';
import { generateSlug, generateUniqueSlug } from '@/lib/slug';

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  categoryIds: z.array(z.number()).optional(),
});

const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required').max(255).optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  categoryIds: z.array(z.number()).optional(),
});

const getPostsSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  status: z.enum(['draft', 'published']).optional(),
  categoryId: z.number().optional(),
  search: z.string().optional(),
});

export const postsRouter = createTRPCRouter({
  // Get all posts with pagination and filtering
  getAll: publicProcedure
    .input(getPostsSchema.optional())
    .query(async ({ ctx, input }) => {
      const { limit = 10, offset = 0, status, categoryId, search } = input ?? {};
      
      // Build the where conditions
      const conditions = [];
      
      if (status) {
        conditions.push(eq(postsTable.status, status));
      }
      
      if (search) {
        conditions.push(
          or(
            like(postsTable.title, `%${search}%`),
            like(postsTable.content, `%${search}%`)
          )
        );
      }

      // If filtering by category, we need a more complex query
      if (categoryId) {
        const postsWithCategory = await ctx.db
          .select({ postId: postCategoriesTable.postId })
          .from(postCategoriesTable)
          .where(eq(postCategoriesTable.categoryId, categoryId));
        
        const postIds = postsWithCategory.map(p => p.postId);
        if (postIds.length > 0) {
          conditions.push(inArray(postsTable.id, postIds));
        } else {
          // No posts found for this category
          return { posts: [], total: 0 };
        }
      }

      // Get posts with their categories
      const posts = await ctx.db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          slug: postsTable.slug,
          content: postsTable.content,
          excerpt: postsTable.excerpt,
          status: postsTable.status,
          publishedAt: postsTable.publishedAt,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt,
        })
        .from(postsTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      // Get categories for each post
      const postsWithCategories = await Promise.all(
        posts.map(async (post) => {
          const categories = await ctx.db
            .select({
              id: categoriesTable.id,
              name: categoriesTable.name,
              slug: categoriesTable.slug,
            })
            .from(categoriesTable)
            .innerJoin(postCategoriesTable, eq(categoriesTable.id, postCategoriesTable.categoryId))
            .where(eq(postCategoriesTable.postId, post.id));
          
          return { ...post, categories };
        })
      );

      // Get total count for pagination (aggregate)
      const totalCountRes = await ctx.db
        .select({ count: count() })
        .from(postsTable)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      const total = Number(totalCountRes?.[0]?.count ?? 0);
      
      return {
        posts: postsWithCategories,
        total,
      };
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db
        .select()
        .from(postsTable)
        .where(eq(postsTable.slug, input.slug))
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Get categories for this post
      const categories = await ctx.db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
        })
        .from(categoriesTable)
        .innerJoin(postCategoriesTable, eq(categoriesTable.id, postCategoriesTable.categoryId))
        .where(eq(postCategoriesTable.postId, post[0].id));

      return { ...post[0], categories };
    }),

  // Get single post by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, input.id))
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Get categories for this post
      const categories = await ctx.db
        .select({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
        })
        .from(categoriesTable)
        .innerJoin(postCategoriesTable, eq(categoriesTable.id, postCategoriesTable.categoryId))
        .where(eq(postCategoriesTable.postId, post[0].id));

      return { ...post[0], categories };
    }),

  // Create new post
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { title, content, excerpt, status, categoryIds } = input;
      
      // Generate slug
      const baseSlug = generateSlug(title);
      const existingSlugs = (await ctx.db.select({ slug: postsTable.slug }).from(postsTable))
        .map(p => p.slug);
      const slug = generateUniqueSlug(baseSlug, existingSlugs);

      // Create post
      const newPost = await ctx.db
        .insert(postsTable)
        .values({
          title,
          slug,
          content,
          excerpt,
          status,
          publishedAt: status === 'published' ? new Date() : null,
        })
        .returning();

      const post = newPost[0];

      // Add categories if provided
      if (categoryIds && categoryIds.length > 0) {
        await ctx.db.insert(postCategoriesTable).values(
          categoryIds.map(categoryId => ({
            postId: post.id,
            categoryId,
          }))
        );
      }

      return post;
    }),

  // Update post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, categoryIds, ...updateData } = input;

      // Check if post exists
      const existingPost = await ctx.db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id))
        .limit(1);

      if (!existingPost[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      const updatedData: Partial<typeof postsTable.$inferInsert> = { ...updateData };

      // Update slug if title is changing
      if (updateData.title) {
        const baseSlug = generateSlug(updateData.title);
        const existingSlugs = (
          await ctx.db
            .select({ slug: postsTable.slug })
            .from(postsTable)
            .where(not(eq(postsTable.id, id)))
        ).map((p) => p.slug);
        
        updatedData.slug = generateUniqueSlug(baseSlug, existingSlugs);
      }

      // Set publishedAt if changing status to published
      if (updateData.status === 'published' && existingPost[0].status !== 'published') {
        updatedData.publishedAt = new Date();
      }

      // Update post
      const updatedPost = await ctx.db
        .update(postsTable)
        .set({ ...updatedData, updatedAt: new Date() })
        .where(eq(postsTable.id, id))
        .returning();

      // Update categories if provided
      if (categoryIds !== undefined) {
        // Remove existing categories
        await ctx.db
          .delete(postCategoriesTable)
          .where(eq(postCategoriesTable.postId, id));

        // Add new categories
        if (categoryIds.length > 0) {
          await ctx.db.insert(postCategoriesTable).values(
            categoryIds.map(categoryId => ({
              postId: id,
              categoryId,
            }))
          );
        }
      }

      return updatedPost[0];
    }),

  // Delete post
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
      const existingPost = await ctx.db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, input.id))
        .limit(1);

      if (!existingPost[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Delete post (categories will be deleted automatically due to cascade)
      await ctx.db
        .delete(postsTable)
        .where(eq(postsTable.id, input.id));

      return { success: true };
    }),
});