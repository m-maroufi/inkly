import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const mediaType = pgEnum("media_type", [
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
]);

export const media = pgTable(
  "media",
  {
    id: uuid().primaryKey().defaultRandom(),
    uploaded_by: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    original_name: text().notNull(),
    storage_key: text().notNull(),
    url: text().notNull(),
    media_type: mediaType().notNull(),
    mime_type: text(),
    size: integer(),
    width: integer(),
    height: integer(),
    alt_text: text(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (t) => [index("media_uploaded_by_idx").on(t.uploaded_by)],
);
