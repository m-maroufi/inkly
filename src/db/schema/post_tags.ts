import { pgTable, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { tags } from "./tags";

// Post tags table
// Junction table implementing the many-to-many relationship between posts and tags.
// Relationships:
// - belongs to posts through post_id (ON DELETE CASCADE)
// - belongs to tags through tag_id (ON DELETE CASCADE)
//
// Design notes:
// - no primary key is declared; the unique index (post_id, tag_id) prevents duplicate pairs.
// - post_tags_tag_id_idx supports reverse lookups ("posts for a tag").

export const post_tags = pgTable(
  "post_tags",
  {
    post_id: uuid()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tag_id: uuid()
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    uniqueIndex("post_tags_post_id_tag_id_uidx").on(
      table.post_id,
      table.tag_id,
    ),
    index("post_tags_tag_id_idx").on(table.tag_id),
  ],
);
