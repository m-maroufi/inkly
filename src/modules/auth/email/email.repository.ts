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
  return user;
}
