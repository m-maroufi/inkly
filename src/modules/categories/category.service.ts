import { findAllCategories } from "./category.repository";

export async function getAllCategories() {
  return findAllCategories();
}
