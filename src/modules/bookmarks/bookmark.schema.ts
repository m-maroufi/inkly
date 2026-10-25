import { z } from "zod";

export const postIdParamSchema = z.object({
  postId: z.uuid("Invalid post ID."),
});