import { NotFoundError } from "../../shared/errors/not-found-error";
import {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
} from "./category.repository";

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
