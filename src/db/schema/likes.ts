import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

// Likes table
// Join table recording which users liked which posts.
// Relationships:
// - belongs to users through user_id (ON DELETE CASCADE)
// - belongs to posts through post_id (ON DELETE CASCADE)
//
// Design notes:
// - composite primary key (user_id, post_id) allows a user to like a post only once.
// - columns are not declared notNull in Drizzle, but the composite PK enforces NOT NULL.
// - no separate index on post_id, so "who liked this post" may scan.

export const likes = pgTable(
  "likes",
  {
    user_id: uuid().references(() => users.id, { onDelete: "cascade" }),
    post_id: uuid().references(() => posts.id, { onDelete: "cascade" }),
    created_at: timestamp().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      columns: [t.user_id, t.post_id],
    }),
  ],
);
