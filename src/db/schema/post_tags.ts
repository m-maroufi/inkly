import { pgTable, uuid, uniqueIndex, index } from "drizzle-orm/pg-core";
import { posts } from "./posts";
import { tags } from "./tags";

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
