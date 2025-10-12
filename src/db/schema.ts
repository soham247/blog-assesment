import { integer, pgTable, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const postStatusEnum = pgEnum('post_status', ['draft', 'published']);

// Categories table
export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  slug: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Blog posts table
export const postsTable = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  content: text().notNull(),
  excerpt: text(),
  status: postStatusEnum('status').default('draft').notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Many-to-many relationship table for posts and categories
export const postCategoriesTable = pgTable("post_categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  postId: integer('post_id').references(() => postsTable.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer('category_id').references(() => categoriesTable.id, { onDelete: 'cascade' }).notNull(),
});

// Define relations
export const postsRelations = relations(postsTable, ({ many }) => ({
  postCategories: many(postCategoriesTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  postCategories: many(postCategoriesTable),
}));

export const postCategoriesRelations = relations(postCategoriesTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postCategoriesTable.postId],
    references: [postsTable.id],
  }),
  category: one(categoriesTable, {
    fields: [postCategoriesTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

// Types for TypeScript
export type Post = typeof postsTable.$inferSelect;
export type NewPost = typeof postsTable.$inferInsert;
export type Category = typeof categoriesTable.$inferSelect;
export type NewCategory = typeof categoriesTable.$inferInsert;
export type PostCategory = typeof postCategoriesTable.$inferSelect;
export type NewPostCategory = typeof postCategoriesTable.$inferInsert;
