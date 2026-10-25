import { and, eq, desc } from "drizzle-orm";
import { db } from "../../db";
import { bookmarks } from "../../db/schema/bookmarks";
import { Bookmark, BookmarkedPostItem } from "./bookmark.types";
import { handleDatabaseError } from "../../shared/errors/database-error";
import { posts } from "../../db/schema/posts";
import { users } from "../../db/schema/users";
import { categories } from "../../db/schema/categories";

export async function findBookmark(
  userId: string,
  postId: string,
): Promise<Bookmark | undefined> {
  const [bookmark] = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.post_id, postId), eq(bookmarks.user_id, userId)));
  return bookmark;
}

export async function createBookmark(userId: string, postId: string) {
  try {
    const [bookmark] = await db
      .insert(bookmarks)
      .values({
        post_id: postId,
        user_id: userId,
        created_at: new Date(),
      })
      .returning();

    return bookmark;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function deleteBookmark(userId: string, postId: string) {
  const [deletedBookmark] = await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.post_id, postId), eq(bookmarks.user_id, userId)))
    .returning();

  return deletedBookmark;
}

export async function findUserBookmarks(
  userId: string,
): Promise<BookmarkedPostItem[]> {
  const bookmarksList = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImageUrl: posts.cover_image_url,
      publishedAt: posts.published_at,
      bookmarkedAt: bookmarks.created_at,
      author: {
        id: users.id,
        username: users.username,
        displayName: users.display_name,
        avatarUrl: users.avatar_url,
      },
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(bookmarks)
    .innerJoin(
      posts,
      and(eq(bookmarks.post_id, posts.id), eq(posts.status, "PUBLISHED")),
    )
    .innerJoin(users, eq(posts.author_id, users.id))
    .innerJoin(categories, eq(posts.category_id, categories.id))
    .where(eq(bookmarks.user_id, userId))
    .orderBy(desc(bookmarks.created_at));

  return bookmarksList;
}
