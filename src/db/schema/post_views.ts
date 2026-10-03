import { pgTable, timestamp, uuid, text, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { users } from "./users";

// Post views table
// Records post view events for both authenticated and anonymous visitors.
// Relationships:
// - post_id -> posts (ON DELETE CASCADE)
// - user_id -> users (ON DELETE SET NULL; null for anonymous views)
//
// Design notes:
// - one row is stored per view event (no deduplication).
// - ip_address and user_agent are stored in plaintext (PII).
// - composite index (post_id, created_at) supports time-series view queries.

export const post_views = pgTable(
  "post_views",
  {
    id: uuid().primaryKey().defaultRandom(),
    post_id: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    user_id: uuid().references(() => users.id, { onDelete: "set null" }),
    ip_address: text(),
    user_agent: text(),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    index("post_views_post_id_idx").on(table.post_id),
    index("post_views_post_id_created_at_idx").on(
      table.post_id,
      table.created_at,
    ),
  ],
);
