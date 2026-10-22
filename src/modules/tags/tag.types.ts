import { z } from "zod";
import { createTagSchema, updateTagSchema } from "./tag.schema";
import { tags } from "../../db/schema/tags";

export type CreateTagInput = z.infer<typeof createTagSchema>;

export type UpdateTagInput = z.infer<typeof updateTagSchema>;

export type Tag = typeof tags.$inferSelect;

export type NewTag = typeof tags.$inferInsert;
