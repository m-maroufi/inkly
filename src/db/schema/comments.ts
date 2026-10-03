import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

// Comments table
// Stores comments on posts, including threaded replies via a self-reference.
// Relationships:
// - belongs to users through user_id (ON DELETE CASCADE)
// - belongs to posts through post_id (ON DELETE CASCADE)
// - self-references comments through parent_id for replies (ON DELETE CASCADE)
// - referenced by notifications and reports
//
// Design notes:
// - parent_id is null for top-level comments.
// - dedicated indexes exist for post, user and parent lookups.

export const comments = pgTable(
  "comments",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    post_id: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    parent_id: uuid(),

    content: text().notNull(),

    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.parent_id],
      foreignColumns: [table.id],
    }).onDelete("cascade"),

    index("comments_post_id_idx").on(table.post_id),
    index("comments_user_id_idx").on(table.user_id),
    index("comments_parent_id_idx").on(table.parent_id),
  ],
);
