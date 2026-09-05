import { index, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";
import { comments } from "./comments";

export const notificationType = pgEnum("notification_type", [
  "POST_LIKED",
  "COMMENT_RECEIVED",
  "COMMENT_REPLY",
  "NEW_FOLLOWER",
  "POST_SUBMITTED_FOR_REVIEW",
  "POST_APPROVED",
  "POST_REJECTED",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid().primaryKey().defaultRandom(),
    recipient_id: uuid().references(() => users.id, { onDelete: "set null" }),
    actor_id: uuid().references(() => users.id, { onDelete: "set null" }),
    type: notificationType().notNull(),
    post_id: uuid().references(() => posts.id, { onDelete: "cascade" }),
    comment_id: uuid().references(() => comments.id, { onDelete: "cascade" }),

    read_at: timestamp(),
    created_at: timestamp().notNull().defaultNow(),
  },
  (t) => [
    index("notifications_recipient_created_at_idx").on(
      t.recipient_id,
      t.created_at,
    ),
  ],
);
