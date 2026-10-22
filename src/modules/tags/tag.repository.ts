import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { tags } from "../../db/schema/tags";
import { CreateTagInput, UpdateTagInput } from "./tag.types";
import { handleDatabaseError } from "../../shared/errors/database-error";

export async function findAllTags() {
  const allTag = await db.select().from(tags).orderBy(desc(tags.created_at));
  return allTag;
}
export async function findTagById(tagId: string) {
  const [tag] = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);
  return tag;
}

export async function findTagBySlug(slug: string) {
  const [tag] = await db
    .select()
    .from(tags)
    .where(eq(tags.slug, slug))
    .limit(1);
  return tag;
}

export async function findTagByName(name: string) {
  const [tag] = await db
    .select()
    .from(tags)
    .where(eq(tags.name, name))
    .limit(1);
  return tag;
}

export async function createTag(data: CreateTagInput, slug: string) {
  try {
    const [tag] = await db
      .insert(tags)
      .values({
        slug: slug,
        name: data.name,
      })
      .returning();
    return tag;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function updateTag(data: UpdateTagInput, tagId: string) {
  try {
    const [tag] = await db
      .update(tags)
      .set({
        name: data.name,
        updated_at: new Date(),
      })
      .where(eq(tags.id, tagId))
      .returning();
    return tag;
  } catch (error) {
    handleDatabaseError(error);
  }
}

export async function deleteTag(id: string) {
  try {
    const [tag] = await db.delete(tags).where(eq(tags.id, id)).returning();
    return tag;
  } catch (error) {
    handleDatabaseError(error);
  }
}
