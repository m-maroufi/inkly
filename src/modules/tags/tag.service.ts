import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { generateSlug } from "../../shared/utils/slug";
import {
  createTag,
  deleteTag,
  findAllTags,
  findTagById,
  findTagByName,
  findTagBySlug,
  updateTag,
} from "./tag.repository";
import { CreateTagInput, UpdateTagInput } from "./tag.types";

export async function getAllTagsService() {
  return findAllTags();
}

export async function getTagByIdService(tagId: string) {
  const tag = await findTagById(tagId);
  if (!tag) {
    throw new NotFoundError("tag not found.");
  }
  return tag;
}

export async function getTagBySlugService(slug: string) {
  const tag = await findTagBySlug(slug);
  if (!tag) {
    throw new NotFoundError("tag not found.");
  }

  return tag;
}

export async function createTagService(data: CreateTagInput) {
  const existingName = await findTagByName(data.name);
  if (existingName) {
    throw new ConflictError("Tag with this name already exists.");
  }

  const slug = generateSlug(data.name);
  const existingSlug = await findTagBySlug(slug);
  if (existingSlug) {
    throw new ConflictError("Tag with this slug already exists.");
  }

  const tag = await createTag(data, slug);

  return tag;
}

export async function updateTagService(data: UpdateTagInput, tagId: string) {
  const tag = await findTagById(tagId);
  if (!tag) {
    throw new NotFoundError("Tag not found.");
  }

  const existing = await findTagByName(data.name);
  if (existing && existing.id !== tagId) {
    throw new ConflictError("Tag with this name already exists.");
  }

  const updatedTag = await updateTag(data, tagId);

  return updatedTag;
}

export async function deleteTagService(tagId: string) {
  const tag = await findTagById(tagId);
  if (!tag) {
    throw new NotFoundError("Tag not found.");
  }
  const deletedTag = await deleteTag(tagId);
  return deletedTag;
}
