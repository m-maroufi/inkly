import { NotFoundError } from "../../shared/errors/not-found-error";
import { findAllCategories, findCategoryById } from "./category.repository";

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
