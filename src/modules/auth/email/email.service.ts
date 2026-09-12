import { randomBytes } from "node:crypto";
import { ConflictError } from "../../../shared/errors/conflict-error";
import { hashPassword } from "../../../shared/security/password";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  markEmailAsVerified,
} from "./email.repository";
import { EmailRegisterInput } from "./email.types";
import {
  deleteEmailVerificationToken,
  getUserIdByEmailVerificationToken,
  storeEmailVerificationToken,
} from "./email-verification-token.store";
import { toPublicUser } from "../../../shared/utils/user";
import { NotFoundError } from "../../../shared/errors/not-found-error";

export async function registerWithEmail(input: EmailRegisterInput) {
  const existingEmail = await findUserByEmail(input.email);
  if (existingEmail) {
    throw new ConflictError("Email is already in use.");
  }

  const existingUsername = await findUserByUsername(input.username);
  if (existingUsername) {
    throw new ConflictError("Username is already in use.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser(input, passwordHash);

  const verificationToken = randomBytes(32).toString("hex");
  await storeEmailVerificationToken(verificationToken, user.id);

  return toPublicUser(user);
}

export async function verifyEmail(token: string) {
  const userId = await getUserIdByEmailVerificationToken(token);
  if (!userId) {
    throw new NotFoundError("Invalid or expired verification token.");
  }
  const user = await markEmailAsVerified(userId);

  await deleteEmailVerificationToken(token);
  return toPublicUser(user);
}
