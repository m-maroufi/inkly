import { randomBytes } from "node:crypto";
import { ConflictError } from "../../../shared/errors/conflict-error";
import { hashPassword } from "../../../shared/security/password";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "./email.repository";
import { EmailRegisterInput } from "./email.types";
import { storeEmailVerificationToken } from "./email-verification-token.store";
import { toPublicUser } from "../../../shared/utils/user";

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
