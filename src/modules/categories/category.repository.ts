import { eq } from "drizzle-orm";
import { db } from "../../db";
import { categories } from "../../db/schema/categories";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.types";
import { handleDatabaseError } from "../../shared/errors/database-error";

export async function findAllCategories() {
  return db.select().from(categories);
}

export async function findCategoryById(id: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);
  return result[0];
}

export async function findCategoryBySlug(slug: string) {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  return result[0];
}

export async function createCategory(data: CreateCategoryInput, slug: string) {
  try {
    const [category] = await db
      .insert(categories)
      .values({
        name: data.name,
        description: data.description ?? null,
        slug,
      })
      .returning();

    return category;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const updateData = {
    ...(data.name !== undefined && { name: data.name }),
    ...(data.description !== undefined && { description: data.description }),
    updated_at: new Date(),
  };

  const result = await db
    .update(categories)
    .set(updateData)
    .where(eq(categories.id, id))
    .returning();
  return result[0];
}

export async function deleteCategory(id: string) {
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();
  return result[0];
}
