import { z } from "zod";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  created_at: Date;
  updated_at: Date;
}
