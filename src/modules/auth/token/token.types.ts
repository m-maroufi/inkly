import z from "zod";
import { userRoleEnum } from "../../../db/schema/users";

export const accessTokenPayloadSchema = z.object({
  sub: z.uuid(),
  role: z.enum(userRoleEnum.enumValues),
});

export type AccessTokenPayload = z.infer<typeof accessTokenPayloadSchema>;

export type CreateRefreshTokenResult = {
  token: string;
  familyId: string;
};

export type RefreshTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
};
