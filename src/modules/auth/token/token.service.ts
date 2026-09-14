import { jwtVerify, SignJWT } from "jose";
import { env } from "../../../config/env";
import type { UserRole } from "../../../db/schema/users";
import { accessTokenPayloadSchema } from "./token.types";

const secret = new TextEncoder().encode(env.jwtAccessSecret);

export async function createAccessToken(userId: string, role: UserRole) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(env.jwtAccessExpiresIn)
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  return accessTokenPayloadSchema.parse(payload);
}
