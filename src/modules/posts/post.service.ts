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
  existsPostBySlug,
  findPostById,
  findPostDetailsBySlug,
  findPostsByAuthor,
  findPublishedPosts,
} from "./post.repository";
import { CreatePostInput } from "./post.types";

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
