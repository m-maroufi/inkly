import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 50 }).notNull(),
  description: text(),
  slug: varchar({ length: 100 }).notNull().unique(),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
