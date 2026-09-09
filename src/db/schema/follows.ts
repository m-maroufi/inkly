import {
  check,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const follows = pgTable(
  "follows",
  {
    follower_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    following_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    created_at: timestamp().notNull().defaultNow(),
  },
  (t) => [
    primaryKey({
      columns: [t.follower_id, t.following_id],
    }),
    check("follows_no_self_follow", sql`${t.follower_id} <> ${t.following_id}`),
  ],
);
