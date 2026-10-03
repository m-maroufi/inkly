import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

// Bookmarks table
// Join table recording which users bookmarked which posts.
// Relationships:
// - belongs to users through user_id (ON DELETE CASCADE)
// - belongs to posts through post_id (ON DELETE CASCADE)
//
// Design notes:
// - composite primary key (user_id, post_id) allows a user to bookmark a post only once.
// - mirrors the likes table structure for saved posts.
// - no separate index on post_id, so "who bookmarked this post" may scan.

export const bookmarks = pgTable(
  "bookmarks",
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
