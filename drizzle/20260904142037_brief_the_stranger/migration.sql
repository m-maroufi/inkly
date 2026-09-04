CREATE TYPE "post_status" AS ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"author_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"slug" text NOT NULL UNIQUE,
	"content" text NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"status" "post_status" DEFAULT 'DRAFT'::"post_status" NOT NULL,
	"cover_image_url" text,
	"cover_image_public_id" text,
	"cover_image_alt" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "posts_author_id_idx" ON "posts" ("author_id");--> statement-breakpoint
CREATE INDEX "posts_category_id_idx" ON "posts" ("category_id");--> statement-breakpoint
CREATE INDEX "posts_status_published_at_idx" ON "posts" ("status","published_at");--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;