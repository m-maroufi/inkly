import { z } from "zod";
import { media, mediaType } from "../../db/schema/media";
import { updateMediaSchema, uploadMediaSchema } from "./media.schema";

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type MediaType = (typeof mediaType.enumValues)[number];

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>;

export type CreateMediaRepositoryInput = {
  uploadedBy: string;
  originalName: string;
  storageKey: string;
  url: string;
  mediaType: MediaType;
  mimeType?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  altText?: string | null;
};
