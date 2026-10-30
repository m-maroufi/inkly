import { follows } from "../../db/schema/follows";

export type Follow = typeof follows.$inferSelect;
export type NewFollow = typeof follows.$inferInsert;

export type ToggleFollowResult = {
  following: boolean;
};

export type FollowUserItem = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  followedAt: Date;
};
