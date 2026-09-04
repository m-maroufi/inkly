import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 50 }).notNull().unique(),
  slug: varchar({ length: 100 }).notNull().unique(),

  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
