import { uploadImage } from "../../lib/cloudinary/cloudinary.service";
import { AppError } from "../../shared/errors/app-error";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { toPublicUser } from "../../shared/utils/user";
import { countFollowers, countFollowing } from "../follows/follow.repository";
import {
  countUserPublishedPosts,
  findUserById,
  findUserByUsername,
  findUserPublishedPosts,
  updateUserProfile,
} from "./user.repository";
import { PublicUserProfile, UpdateProfileInput } from "./user.types";

export async function getMyProfileService(
  userId: string,
): Promise<PublicUserProfile> {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new NotFoundError("user not found.");
  }
  const countuserPostPublish = await countUserPublishedPosts(userId);
  const countFollowersUser = await countFollowers(userId);
  const countFollowingsUser = await countFollowing(userId);
  return {
    id: existingUser.id,
    username: existingUser.username,
    avatarUrl: existingUser.avatar_url,
    displayName: existingUser.display_name,
    bio: existingUser.bio,
    role: existingUser.role,
    createdAt: existingUser.created_at,
    stats: {
      followersCount: countFollowersUser,
      followingCount: countFollowingsUser,
      postsCount: countuserPostPublish,
    },
  };
}

export async function updateMyProfileService(
  userId: string,
  data: UpdateProfileInput,
  avatarBuffer?: Buffer,
) {
  const existingUser = await findUserById(userId);
  if (!existingUser) {
    throw new NotFoundError("user not found.");
  }
  if (data.username && data.username !== existingUser.username) {
    const existingUsername = await findUserByUsername(data.username);
    if (existingUsername) {
      throw new ConflictError("Username is already taken.");
    }
  }

  let avatarUrl: string | undefined;
  if (avatarBuffer) {
    const uploaded = await uploadImage(avatarBuffer, "inkly/avatars");
    avatarUrl = uploaded.url;
  }
  const updatedUser = await updateUserProfile(userId, {
    ...data,
    ...(avatarUrl && { avatarUrl }),
  });
  if (!updatedUser) {
    throw new AppError("Failed to update profile.", 500);
  }
  return toPublicUser(updatedUser);
}

export async function getPublicProfileByUsernameService(
  username: string,
): Promise<PublicUserProfile> {
  const author = await findUserByUsername(username);

  if (!author) {
    throw new NotFoundError("Author not found.");
  }

  const countuserPostPublish = await countUserPublishedPosts(author.id);
  const countFollowersUser = await countFollowers(author.id);
  const countFollowingsUser = await countFollowing(author.id);
  return {
    id: author.id,
    username: author.username,
    avatarUrl: author.avatar_url,
    displayName: author.display_name,
    bio: author.bio,
    role: author.role,
    createdAt: author.created_at,
    stats: {
      followersCount: countFollowersUser,
      followingCount: countFollowingsUser,
      postsCount: countuserPostPublish,
    },
  };
}

export async function getUserPublishedPostsService(username: string) {
  const author = await findUserByUsername(username);

  if (!author) {
    throw new NotFoundError("Author not found.");
  }
  const posts = await findUserPublishedPosts(author.id);
  return posts;
}
