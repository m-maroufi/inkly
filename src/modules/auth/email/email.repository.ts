import { eq } from "drizzle-orm";
import { db } from "../../../db";
import { users } from "../../../db/schema/users";
import { EmailRegisterInput } from "./email.types";

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return result[0];
}

export async function findUserByUsername(username: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return result[0];
}

export async function createUser(
  data: EmailRegisterInput,
  passwordHash: string,
) {
  const [user] = await db
    .insert(users)
    .values({
      email: data.email,
      display_name: data.displayName,
      username: data.username,
      password_hash: passwordHash,
    })
    .returning();

  if (!user) {
    throw new Error("Failed to create user.");
  }
  return user;
}

export async function findUserById(userId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function markEmailAsVerified(userId: string) {
  const [user] = await db
    .update(users)
    .set({
      email_verified_at: new Date(),
      updated_at: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();

  if (!user) {
    throw new Error("Failed to verify email.");
  }
  return user;
}

export async function updateUserPassword(
  userId: string,
  password_hash: string,
) {
  const [user] = await db
    .update(users)
    .set({
      password_hash: password_hash,
      updated_at: new Date(),
    })
    .where(eq(users.id, userId))
    .returning();
  return user;
}
