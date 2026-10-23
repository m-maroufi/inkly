import { UserRole } from "../../db/schema/users";
import { AppError } from "../../shared/errors/app-error";
import { AuthorizationError } from "../../shared/errors/authorization-error";
import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { findPostById } from "../posts/post.repository";
import {
  createComment,
  deleteComment,
  findCommentById,
  findCommentsByPostId,
  findCommentWithAuthorById,
  updateComment,
} from "./comment.repository";
import {
  CommentWithReplies,
  CreateCommentInput,
  UpdateCommentInput,
} from "./comment.types";

export async function getCommentsByPostIdService(
  postId: string,
): Promise<CommentWithReplies[]> {
  const post = await findPostById(postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }

  const rawComments = await findCommentsByPostId(postId);

  const commentMap = new Map<string, CommentWithReplies>();
  const rootComments: CommentWithReplies[] = [];

  for (const comment of rawComments) {
    commentMap.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of rawComments) {
    const commentWithReplies = commentMap.get(comment.id);
    if (!commentWithReplies) continue;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(commentWithReplies);
      } else {
        rootComments.push(commentWithReplies);
      }
    } else {
      rootComments.push(commentWithReplies);
    }
  }
  return rootComments;
}

export async function createCommentService(
  userId: string,
  postId: string,
  data: CreateCommentInput,
) {
  const post = await findPostById(postId);
  if (!post || post.status !== "PUBLISHED") {
    throw new NotFoundError("Post not found.");
  }
  let parentComment;
  if (data.parentId) {
    parentComment = await findCommentById(data.parentId);
    if (!parentComment) {
      throw new NotFoundError("Parent Comment Not Found.");
    }

    if (parentComment.post_id !== post.id) {
      throw new ConflictError("Parent comment belongs to a different post.");
    }
  }

  const createdComment = await createComment({
    postId: post.id,
    userId: userId,
    content: data.content,
    parentId: parentComment ? parentComment.id : null,
  });

  if (!createdComment) {
    throw new AppError("Failed to create comment.", 500);
  }
  const comment = await findCommentWithAuthorById(createdComment.id);
  return comment;
}

export async function updateCommentService(
  commentId: string,
  userId: string,
  data: UpdateCommentInput,
) {
  const commentForEdit = await findCommentById(commentId);
  if (!commentForEdit) {
    throw new NotFoundError("Comment not Found.");
  }

  if (commentForEdit.user_id !== userId) {
    throw new AuthorizationError("You are not allowed to update this comment.");
  }

  const updatedComment = await updateComment(commentId, data.content);
  if (!updatedComment) {
    throw new AppError("Failed to update comment.", 500);
  }
  const comment = await findCommentWithAuthorById(updatedComment.id);
  return comment;
}

export async function deleteCommentService(
  commentId: string,
  user: { id: string; role: UserRole },
) {
  const existingComment = await findCommentById(commentId);
  if (!existingComment) {
    throw new NotFoundError("Comment not Found.");
  }

  const isAuthorComment = existingComment.user_id === user.id;
  const isAdmin = user.role === "ADMIN";

  const post = await findPostById(existingComment.post_id);

  const isAuthorPost = post?.author_id === user.id;
  if (!isAdmin && !isAuthorComment && !isAuthorPost) {
    throw new AuthorizationError("You are not allowed to delete this comment.");
  }

  const deletedcomment = await deleteComment(existingComment.id);
  if (!deletedcomment) {
    throw new AppError("Failed to delete comment.", 500);
  }
  return {
    id: deletedcomment.id,
  };
}
