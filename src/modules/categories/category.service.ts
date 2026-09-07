import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { generateSlug } from "../../shared/utils/slug";
import {
  createCategory,
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
} from "./category.repository";
import { CreateCategoryInput } from "./category.types";

export async function getAllCategories() {
  return findAllCategories();
}

export async function getCategoryById(id: string) {
  const category = await findCategoryById(id);
  if (!category) {
    throw new NotFoundError("category Not Found");
  }
  return category;
}

export async function getCategoryBySlug(slug: string) {
  const category = await findCategoryBySlug(slug);
  if (!category) {
    throw new NotFoundError("category Not Found");
  }
  return category;
}

export async function createCategoryService(data: CreateCategoryInput) {
  const slug = generateSlug(data.name);

  const existsSlug = await findCategoryBySlug(slug);
  if (existsSlug) {
    throw new ConflictError("Category with this slug already exists.");
  }
  const category = await createCategory(data, slug);

  return category;
}
