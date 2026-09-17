import { randomBytes } from "node:crypto";
import { ConflictError } from "../../../shared/errors/conflict-error";
import {
  hashPassword,
  verifyPassword,
} from "../../../shared/security/password";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
  markEmailAsVerified,
} from "./email.repository";
import { EmailLoginInput, EmailRegisterInput } from "./email.types";
import {
  deleteEmailVerificationToken,
  getUserIdByEmailVerificationToken,
  storeEmailVerificationToken,
} from "./email-verification-token.store";
import { toPublicUser } from "../../../shared/utils/user";
import { NotFoundError } from "../../../shared/errors/not-found-error";
import { AuthenticationError } from "../../../shared/errors/authentication-error";
import { createAccessToken, createRefreshToken } from "../token/token.service";
import { env } from "../../../config/env";
import { buildEmailVerificationEmail } from "./email.templates";
import { sendEmail } from "../../../lib/email/email.service";

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
  await sendVerificationEmail(user.email!, verificationToken);
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

// login logic

export async function loginWithEmail(input: EmailLoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new AuthenticationError("Invalid email or password.");
  }

  if (!user.email_verified_at) {
    throw new AuthenticationError("Email address is not verified.");
  }

  const passwordIsValid = await verifyPassword(
    user.password_hash ?? "",
    input.password,
  );
  if (!passwordIsValid) {
    throw new AuthenticationError("Invalid email or password.");
  }
  // create authentication tokens
  const accessToken = await createAccessToken(user.id, user.role);
  const refreshToken = await createRefreshToken(user.id);

  return {
    user: toPublicUser(user),
    accessToken,
    refreshToken: refreshToken.token,
  };
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${env.appUrl}/api/v1/auth/email/verify?token=${encodeURIComponent(token)}`;

  const emailContent = buildEmailVerificationEmail(verificationUrl);

  return sendEmail({
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
  });
}
