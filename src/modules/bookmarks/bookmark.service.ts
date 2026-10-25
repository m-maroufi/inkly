import { AppError } from "../../shared/errors/app-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { findPostById } from "../posts/post.repository";
import {
  createBookmark,
  deleteBookmark,
  findBookmark,
  findUserBookmarks,
} from "./bookmark.repository";

export async function toggleBookmarkService(userId: string, postId: string) {
  const post = await findPostById(postId);

  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  const isBookmark = await findBookmark(userId, postId);

  if (isBookmark) {
    const result = await deleteBookmark(userId, postId);
    if (!result) {
      throw new AppError("failed deleteing Bookmark post. ", 500);
    }
    return {
      bookmarked: false,
    };
  }

  const bookmark = await createBookmark(userId, postId);
  if (!bookmark) {
    throw new AppError("failed Bookmarking post. ", 500);
  }
  return {
    bookmarked: true,
  };
}

export async function checkBookmarkStatusService(
  userId: string,
  postId: string,
) {
  const post = await findPostById(postId);

  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  const isBookmark = await findBookmark(userId, postId);

  return {
    bookmarked: Boolean(isBookmark),
  };
}

export async function getMyBookmarksService(userId: string) {
  const bookmarkedList = await findUserBookmarks(userId);
  return bookmarkedList;
}
