import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema/users";
import { UpdateUserProfileRepositoryInput } from "./user.types";
import { posts } from "../../db/schema/posts";
import { and } from "drizzle-orm";
import { categories } from "../../db/schema/categories";
import { handleDatabaseError } from "../../shared/errors/database-error";

export async function findUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user;
}

export async function findUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user;
}

export async function updateUserProfile(
  userId: string,
  data: UpdateUserProfileRepositoryInput,
) {
  try {
    const updateData: Partial<typeof users.$inferInsert> = {
      updated_at: new Date(),
    };

    if (data.displayName !== undefined)
      updateData.display_name = data.displayName;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    return user;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function countUserPublishedPosts(
  authorId: string,
): Promise<number> {
  const [countPublishedPost] = await db
    .select({
      count: count(),
    })
    .from(posts)
    .where(and(eq(posts.author_id, authorId), eq(posts.status, "PUBLISHED")));
  return countPublishedPost?.count || 0;
}

export async function findUserPublishedPosts(authorId: string) {
  const publishedPostList = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImageUrl: posts.cover_image_url,
      publishedAt: posts.published_at,
      createdAt: posts.created_at,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },
    })
    .from(posts)
    .innerJoin(categories, eq(posts.category_id, categories.id))
    .where(and(eq(posts.author_id, authorId), eq(posts.status, "PUBLISHED")))
    .orderBy(desc(posts.published_at));

  return publishedPostList;
}
