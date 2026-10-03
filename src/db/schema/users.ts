import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER", "AUTHOR"]);

// Users table
// Stores application user accounts (identity, credentials, profile, role and verification state).
// Related entities:
// - posts (author)
// - comments (author)
// - likes / bookmarks
// - follows (follower and following)
// - notifications (recipient and actor)
// - media (uploader)
// - post_views (optional viewer)
// - reports (reporter and reported user)
// - refresh_tokens
//
// Design notes:
// - email, phone and username are unique; email/phone are nullable until verified.
// - role is constrained by the user_role enum (ADMIN, USER, AUTHOR).
// - updated_at defaults to now() but is not auto-updated by the database.

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
export type UserRole = (typeof userRoleEnum.enumValues)[number];
