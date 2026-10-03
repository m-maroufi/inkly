import { check, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";

export const reasonType = pgEnum("reason_type", [
  "SPAM",
  "HARASSMENT",
  "HATE_SPEECH",
  "MISINFORMATION",
  "COPYRIGHT",
  "INAPPROPRIATE_CONTENT",
  "OTHER",
]);

export const reportStatusType = pgEnum("report_status_type", [
  "PENDING",
  "REVIEWED",
  "DISMISSED",
  "ACTION_TAKEN",
]);

// Reports table
// Stores moderation reports against a post, a comment, or a user.
// Relationships:
// - reporter_id -> users (ON DELETE SET NULL)
// - post_id -> posts (ON DELETE SET NULL)
// - comment_id -> comments (ON DELETE SET NULL)
// - reported_user_id -> users (ON DELETE SET NULL)
//
// Design notes:
// - reason and status are constrained by the reason_type and report_status_type enums.
// - reports_exactly_one_target check requires exactly one of post_id, comment_id or
//   reported_user_id to be non-null.
// - no indexes on target/status columns, so moderation listing queries may scan.

export const reports = pgTable(
  "reports",
  {
    id: uuid().primaryKey().defaultRandom(),

    reporter_id: uuid().references(() => users.id, {
      onDelete: "set null",
    }),

    post_id: uuid().references(() => posts.id, {
      onDelete: "set null",
    }),

    comment_id: uuid().references(() => comments.id, {
      onDelete: "set null",
    }),

    reported_user_id: uuid().references(() => users.id, {
      onDelete: "set null",
    }),

    reason: reasonType().notNull(),
    description: text(),
    status: reportStatusType().notNull().default("PENDING"),
  },
  (t) => [
    check(
      "reports_exactly_one_target",
      sql`
        (
          (${t.post_id} IS NOT NULL)::int +
          (${t.comment_id} IS NOT NULL)::int +
          (${t.reported_user_id} IS NOT NULL)::int
        ) = 1
      `,
    ),
  ],
);
