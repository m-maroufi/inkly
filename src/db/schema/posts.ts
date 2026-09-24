import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const postStatus = pgEnum("post_status", [
  "DRAFT",
  "PENDING_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
]);

export const posts = pgTable(
  "posts",
  {
    id: uuid().primaryKey().defaultRandom(),

    author_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    category_id: uuid()
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),

    title: text().notNull(),
    excerpt: text(),
    slug: text().notNull().unique(),
    content: text().notNull(),

    seo_title: text(),
    seo_description: text(),

    status: postStatus().notNull().default("DRAFT"),

    cover_image_url: text(),
    cover_image_public_id: text(),
    cover_image_alt: text(),

    published_at: timestamp(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),

    rejection_reason: text(),
  },
  (table) => [
    index("posts_author_id_idx").on(table.author_id),
    index("posts_category_id_idx").on(table.category_id),
    index("posts_status_published_at_idx").on(table.status, table.published_at),
  ],
);
