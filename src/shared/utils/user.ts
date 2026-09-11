import type { InferSelectModel } from "drizzle-orm";
import { users } from "../../db/schema/users";

type User = InferSelectModel<typeof users>;

export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    role: user.role,
    email_verified_at: user.email_verified_at,
    phone_verified_at: user.phone_verified_at,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}
