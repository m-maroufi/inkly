import { UserRole } from "../../db/schema/users";
import {
  deleteImage,
  uploadImage,
} from "../../lib/cloudinary/cloudinary.service";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { generateSlug } from "../../shared/utils/slug";
import { findCategoryById } from "../categories/category.repository";
import {
  createPost,
  deletePost,
  existsPostBySlug,
  findPostById,
  findPostDetailsBySlug,
  findPostsByAuthor,
  findPublishedPosts,
  updatePost,
} from "./post.repository";
import { CreatePostInput, UpdatePostInput } from "./post.types";

export async function createPostService(
  data: CreatePostInput,
  authorId: string,
  imageBuffer?: Buffer,
) {
  // check category
  const category = await findCategoryById(data.categoryId);

  if (!category) {
    throw new NotFoundError("Category not found");
  }
  //create and check exist slug
  const slug = generateSlug(data.title);
  const slugExists = await existsPostBySlug(slug);
  if (slugExists) {
    throw new ConflictError("A post with this title already exists.");
  }

  // 4. Upload image
  let uploadedImage;

  if (imageBuffer) {
    uploadedImage = await uploadImage(imageBuffer, "inkly/posts");
  }
  try {
    const post = await createPost(
      {
        ...data,
        ...(uploadedImage && {
          coverImageUrl: uploadedImage.url,
          coverImagePublicId: uploadedImage.publicId,
        }),
      },
      authorId,
      slug,
    );

    return post;
  } catch (error) {
    // 6. Rollback Cloudinary upload
    if (uploadedImage) {
      await deleteImage(uploadedImage.publicId);
    }

    throw error;
  }
}

export async function getPublishedPostsService() {
  return findPublishedPosts();
}

export async function getPublishedPostDetailsService(slug: string) {
  const post = await findPostDetailsBySlug(slug);

  if (!post) {
    throw new NotFoundError("Post not found.");
  }

  return post;
}

export async function getAuthorPostsService(authorId: string) {
  return findPostsByAuthor(authorId);
}

export async function getAuthorPostByIdService(
  authorId: string,
  postId: string,
) {
  const post = await findPostById(postId);
  if (!post) {
    throw new NotFoundError("Post not found.");
  }
  if (post.author_id !== authorId) {
    throw new NotFoundError("Post not found.");
  }
  return post;
}

export async function updatePostService(
  postId: string,
  authorId: string,
  data: UpdatePostInput,
  imageBuffer?: Buffer,
) {
  const post = await findPostById(postId);
  if (!post) {
    throw new NotFoundError("Post not found.");
  }
  if (post.author_id !== authorId) {
    throw new NotFoundError("Post not found.");
  }

  if (post.status !== "DRAFT") {
    throw new ConflictError("Only draft posts can be edited.");
  }

  if (data.categoryId) {
    const category = await findCategoryById(data.categoryId);
    if (!category) {
      throw new NotFoundError("Category not found.");
    }
  }

  let uploadedImage;
  if (imageBuffer) {
    uploadedImage = await uploadImage(imageBuffer, "inkly/posts");
  }

  try {
    const updateData = {
      ...data,
      ...(uploadedImage && {
        coverImageUrl: uploadedImage.url,
        coverImagePublicId: uploadedImage.publicId,
      }),
    };

    const updatedPost = await updatePost(postId, updateData);

    if (uploadedImage && post.cover_image_public_id) {
      await deleteImage(post.cover_image_public_id);
    }

    return updatedPost;
  } catch (error) {
    // 6. Rollback Cloudinary upload
    if (uploadedImage) {
      await deleteImage(uploadedImage.publicId);
    }
    throw error;
  }
}

export async function deletePostService(
  user: { id: string; role: UserRole },
  postId: string,
) {
  const post = await findPostById(postId);
  if (!post) {
    throw new NotFoundError("Post not found.");
  }
  const isOwner = post.author_id === user.id;
  const isAdmin = user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    throw new NotFoundError("Post not found.");
  }

  if (post.status === "PENDING_REVIEW") {
    throw new ConflictError("Posts under review cannot be deleted.");
  }

  const deletedPost = await deletePost(postId);

  if (!deletedPost) {
    throw new NotFoundError("Post not found.");
  }
  
  if (post.cover_image_public_id) {
    await deleteImage(post.cover_image_public_id);
  }

  return deletedPost;
}
