ALTER TABLE "media" ALTER COLUMN "media_type" SET DATA TYPE "media_type" USING "media_type"::"media_type";--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "media_type" SET NOT NULL;