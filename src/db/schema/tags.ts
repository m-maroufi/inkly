import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

// Tags table
// Stores reusable tags that can be attached to many posts.
// Related entities:
// - posts (many-to-many through post_tags)
//
// Design notes:
// - both name and slug are unique.
// - tags are shared across posts rather than owned by a single post.

export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 50 }).notNull().unique(),
  slug: varchar({ length: 100 }).notNull().unique(),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
