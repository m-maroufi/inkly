import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER", "AUTHOR"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique(),
  phone: text().unique(),
  username: varchar({ length: 50 }).notNull().unique(),
  password_hash: text(),
  display_name: varchar({ length: 50 }).notNull(),
  avatar_url: text(),
  bio: text(),
  role: userRoleEnum().notNull().default("USER"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
  email_verified_at: timestamp(),
  phone_verified_at: timestamp(),
});
