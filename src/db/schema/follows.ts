import {
  check,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

// Follows table
// Self-referencing join table modeling the follower/following graph between users.
// Relationships:
// - belongs to users through follower_id (the user who follows, ON DELETE CASCADE)
// - belongs to users through following_id (the user being followed, ON DELETE CASCADE)
//
// Design notes:
// - composite primary key (follower_id, following_id) prevents duplicate follows.
// - follows_no_self_follow check prevents a user from following themselves.
// - no separate index on following_id, so "who follows me" may scan.

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
