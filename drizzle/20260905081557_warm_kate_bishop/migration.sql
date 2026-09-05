CREATE TABLE "bookmarks" (
	"user_id" uuid,
	"post_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_pkey" PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_post_id_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE;