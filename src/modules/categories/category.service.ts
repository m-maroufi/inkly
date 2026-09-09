import { ConflictError } from "../../shared/errors/conflict-error";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { generateSlug } from "../../shared/utils/slug";
import {
  createCategory,
  deleteCategory,
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  updateCategory,
} from "./category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.types";

export async function getAllCategories() {
  return findAllCategories();
}

export async function getCategoryById(id: string) {
  const category = await findCategoryById(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
}

export async function getCategoryBySlug(slug: string) {
  const category = await findCategoryBySlug(slug);
  if (!category) {
    throw new NotFoundError("Category not found");
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

export async function updateCategoryService(
  id: string,
  data: UpdateCategoryInput,
) {
  const categoryExist = await findCategoryById(id);
  if (!categoryExist) {
    throw new NotFoundError("Category not found");
  }
  const category = await updateCategory(id, data);
  return category;
}

export async function deleteCategoryService(id: string) {
  const category = deleteCategory(id);
  if (!category) {
    throw new NotFoundError("Category not found");
  }
  return category;
}
