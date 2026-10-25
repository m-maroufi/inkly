import { likes } from "../../db/schema/likes";

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

export type LikedUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  likedAt: Date;
};

export type ToggleLikeResult = {
  liked: boolean;
  likesCount: number;
};
