import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../db";
import { posts, PostStatus } from "../../db/schema/posts";
import { CreatePostRepositoryInput, UpdatePostInput } from "./post.types";
import { handleDatabaseError } from "../../shared/errors/database-error";
import { users } from "../../db/schema/users";
import { categories } from "../../db/schema/categories";
import { likes } from "../../db/schema/likes";
import { comments } from "../../db/schema/comments";
import { post_views } from "../../db/schema/post_views";
import { tags } from "../../db/schema/tags";
import { post_tags } from "../../db/schema/post_tags";
import { and } from "drizzle-orm";
import { NotFoundError } from "../../shared/errors/not-found-error";

export async function findAllPosts() {
  const result = await db.select().from(posts).orderBy(desc(posts.created_at));
  return result;
}

export async function findPublishedPosts() {
  const publishedPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "PUBLISHED"))
    .orderBy(desc(posts.published_at));
  return publishedPosts;
}

export async function findPostById(id: string) {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}

export async function findPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  return result[0];
}

export async function findPostsByAuthor(authorId: string) {
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.author_id, authorId))
    .orderBy(desc(posts.created_at));
  return result;
}

export async function createPost(
  data: CreatePostRepositoryInput,
  authorId: string,
  slug: string,
) {
  try {
    const [post] = await db
      .insert(posts)
      .values({
        author_id: authorId,
        category_id: data.categoryId,
        title: data.title,
        excerpt: data.excerpt ?? null,
        slug: slug,
        content: data.content,
        seo_title: data.seoTitle ?? null,
        seo_description: data.seoDescription ?? null,

        cover_image_alt: data.coverImageAlt ?? null,
        cover_image_public_id: data.coverImagePublicId ?? null,
        cover_image_url: data.coverImageUrl ?? null,
      })
      .returning();
    return post;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function updatePost(id: string, data: UpdatePostInput) {
  try {
    const updateData = {
      ...(data.title !== undefined && {
        title: data.title,
      }),

      ...(data.excerpt !== undefined && {
        excerpt: data.excerpt,
      }),

      ...(data.categoryId !== undefined && {
        category_id: data.categoryId,
      }),

      ...(data.content !== undefined && {
        content: data.content,
      }),

      ...(data.seoTitle !== undefined && {
        seo_title: data.seoTitle,
      }),

      ...(data.seoDescription !== undefined && {
        seo_description: data.seoDescription,
      }),

      ...(data.coverImageUrl !== undefined && {
        cover_image_url: data.coverImageUrl,
      }),

      ...(data.coverImagePublicId !== undefined && {
        cover_image_public_id: data.coverImagePublicId,
      }),

      ...(data.coverImageAlt !== undefined && {
        cover_image_alt: data.coverImageAlt,
      }),

      updated_at: new Date(),
    };

    const result = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id))
      .returning();

    return result[0];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function deletePost(id: string) {
  try {
    const result = await db.delete(posts).where(eq(posts.id, id)).returning();

    return result[0];
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function existsPostBySlug(slug: string) {
  const post = await findPostBySlug(slug);

  return Boolean(post);
}

export async function findPostDetailsBySlug(slug: string) {
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      excerpt: posts.excerpt,
      content: posts.content,
      slug: posts.slug,

      coverImageUrl: posts.cover_image_url,
      coverImageAlt: posts.cover_image_alt,

      status: posts.status,

      createdAt: posts.created_at,
      updatedAt: posts.updated_at,
      publishedAt: posts.published_at,

      author: {
        id: users.id,
        username: users.username,
        displayName: users.display_name,
        avatarUrl: users.avatar_url,
        bio: users.bio,
      },

      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      },

      stats: {
        likes: sql<number>`
          (
            SELECT COUNT(*)
            FROM ${likes}
            WHERE ${likes.post_id} = ${posts.id}
          )
        `.as("likes_count"),

        comments: sql<number>`
          (
            SELECT COUNT(*)
            FROM ${comments}
            WHERE ${comments.post_id} = ${posts.id}
          )
        `.as("comments_count"),

        views: sql<number>`
          (
            SELECT COUNT(*)
            FROM ${post_views}
            WHERE ${post_views.post_id} = ${posts.id}
          )
        `.as("views_count"),
      },
    })
    .from(posts)

    .innerJoin(users, eq(posts.author_id, users.id))

    .innerJoin(categories, eq(posts.category_id, categories.id))

    .where(and(eq(posts.slug, slug), eq(posts.status, "PUBLISHED")))

    .limit(1);

  if (!result[0]) {
    return undefined;
  }

  const postTags = await db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })

    .from(post_tags)

    .innerJoin(tags, eq(post_tags.tag_id, tags.id))

    .where(eq(post_tags.post_id, result[0].id));

  return {
    ...result[0],
    tags: postTags,
  };
}

export async function findPendingPosts() {
  const pendingPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "PENDING_REVIEW"))
    .orderBy(desc(posts.created_at));
  return pendingPosts;
}

export async function updatePostStatus(
  id: string,
  status: PostStatus,
  extraData?: {
    rejectionReason?: string | null;
    publishedAt?: Date | null;
  },
) {
  try {
    const [updatedPost] = await db
      .update(posts)
      .set({
        status,
        ...(extraData?.rejectionReason !== undefined && {
          rejection_reason: extraData.rejectionReason,
        }),
        ...(extraData?.publishedAt !== undefined && {
          published_at: extraData.publishedAt,
        }),
        updated_at: new Date(),
      })
      .where(eq(posts.id, id))
      .returning();
    if (!updatedPost) {
      throw new NotFoundError("Post not found.");
    }
    return updatedPost;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function findTagsByIds(tagIds: string[]) {
  if (tagIds.length === 0) {
    return [];
  }

  const result = await db.select().from(tags).where(inArray(tags.id, tagIds));

  return result;
}

export async function attachTagsToPost(postId: string, tagIds: string[]) {
  if (tagIds.length === 0) return;

  const records = tagIds.map((tagId) => ({
    post_id: postId,
    tag_id: tagId,
  }));

  // با onConflictDoNothing اگه کاربر تگ تکراری فرستاده بود، بدون خطا ازش رد میشه
  await db.insert(post_tags).values(records).onConflictDoNothing();
}

export async function syncPostTags(postId: string, tagIds: string[]) {
  await db.transaction(async (tx) => {
    // ۱. پاک کردن تگ‌های قبلی پست
    await tx.delete(post_tags).where(eq(post_tags.post_id, postId));

    // ۲. درج تگ‌های جدید در صورت وجود
    if (tagIds.length > 0) {
      const records = tagIds.map((tagId) => ({
        post_id: postId,
        tag_id: tagId,
      }));

      await tx.insert(post_tags).values(records).onConflictDoNothing();
    }
  });
}

export async function findTagsByPostId(postId: string) {
  return db
    .select({
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(post_tags)
    .innerJoin(tags, eq(post_tags.tag_id, tags.id))
    .where(eq(post_tags.post_id, postId));
}
