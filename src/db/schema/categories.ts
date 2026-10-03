import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Categories table
// Stores the single category each post belongs to.
// Related entities:
// - posts (one category has many posts)
//
// Design notes:
// - slug is unique for SEO-friendly URLs; name is not unique.
// - posts.category_id uses ON DELETE RESTRICT, so populated categories cannot be deleted.

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 50 }).notNull(),
  description: text(),
  slug: varchar({ length: 100 }).notNull().unique(),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
