import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const refresh_tokens = pgTable(
  "refresh_tokens",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token_hash: text().notNull().unique(),
    family_id: uuid().notNull(),
    expires_at: timestamp().notNull(),
    revoked_at: timestamp(),
    created_at: timestamp().notNull().defaultNow(),
  },
  (t) => [
    index("refresh_tokens_family_id_idx").on(t.family_id),
    index("refresh_tokens_user_id_idx").on(t.user_id),
  ],
);
