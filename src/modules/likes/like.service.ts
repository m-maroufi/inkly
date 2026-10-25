import { AppError } from "../../shared/errors/app-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { findPostById } from "../posts/post.repository";
import {
  countLikesByPostId,
  createLike,
  deleteLike,
  findLike,
  findLikedUsersByPostId,
} from "./like.repository";

export async function toggleLikeService(userId: string, postId: string) {
  const post = await findPostById(postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  const likedPost = await findLike(userId, postId);

  if (likedPost) {
    await deleteLike(userId, postId);
    const likesCount = await countLikesByPostId(postId);
    return {
      liked: false,
      likesCount,
    };
  }

  const liked = await createLike(userId, postId);
  if (!liked) {
    throw new AppError("Failed to like the post.", 500);
  }

  const likesCount = await countLikesByPostId(postId);
  return {
    liked: true,
    likesCount,
  };
}

export async function checkLikeStatusService(userId: string, postId: string) {
  const post = await findPostById(postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }
  const likedPost = await findLike(userId, postId);

  return {
    liked: Boolean(likedPost),
  };
}

export async function getPostLikesService(postId: string) {
  const post = await findPostById(postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  const likesCount = await countLikesByPostId(postId);
  const users = await findLikedUsersByPostId(postId);

  return {
    likesCount,
    users,
  };
}
