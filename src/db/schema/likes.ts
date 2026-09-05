import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const likes = pgTable(
  "likes",
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
