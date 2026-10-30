import { AppError } from "../../shared/errors/app-error";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { findUserById } from "../auth/email/email.repository";
import {
  countFollowers,
  countFollowing,
  createFollow,
  deleteFollow,
  findFollow,
  findFollowersByUserId,
  findFollowingByUserId,
} from "./follow.repository";
import { ToggleFollowResult } from "./follow.types";

export async function toggleFollowService(
  followerId: string,
  followingId: string,
): Promise<ToggleFollowResult> {
  if (followerId === followingId) {
    throw new ConflictError("You can not follow yourself.");
  }
  const userForFollow = await findUserById(followingId);
  if (!userForFollow) {
    throw new NotFoundError("User not found.");
  }

  const isFollow = await findFollow(followerId, followingId);

  if (isFollow) {
    const unfollow = await deleteFollow(followerId, followingId);
    if (!unfollow) {
      throw new AppError("unfollow Proccess Failed", 500);
    }
    return {
      following: false,
    };
  }
  const newFollow = await createFollow(followerId, followingId);
  if (!newFollow) {
    throw new AppError("follow Proccess Failed", 500);
  }
  return {
    following: true,
  };
}

export async function checkFollowStatusService(
  followerId: string,
  followingId: string,
) {
  const userFollow = await findUserById(followingId);
  if (!userFollow) {
    throw new NotFoundError("User not found.");
  }
  const follow = await findFollow(followerId, followingId);
  return { following: Boolean(follow) };
}

export async function getUserFollowersService(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const followes = await findFollowersByUserId(userId);
  const countFollower = await countFollowers(userId);
  return {
    followersCount: countFollower,
    followers: followes,
  };
}

export async function getUserFollowingService(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const following = await findFollowingByUserId(userId);
  const countFollowings = await countFollowing(userId);
  return {
    followingCount: countFollowings,
    following: following,
  };
}
