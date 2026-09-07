CREATE TYPE "reason_type" AS ENUM('SPAM', 'HARASSMENT', 'HATE_SPEECH', 'MISINFORMATION', 'COPYRIGHT', 'INAPPROPRIATE_CONTENT', 'OTHER');--> statement-breakpoint
CREATE TYPE "report_status_type" AS ENUM('PENDING', 'REVIEWED', 'DISMISSED', 'ACTION_TAKEN');--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"reporter_id" uuid,
	"post_id" uuid,
	"comment_id" uuid,
	"reported_user_id" uuid,
	"reason" "reason_type" NOT NULL,
	"description" text,
	"status" "report_status_type" DEFAULT 'PENDING'::"report_status_type" NOT NULL,
	CONSTRAINT "reports_exactly_one_target" CHECK (
        (
          ("post_id" IS NOT NULL)::int +
          ("comment_id" IS NOT NULL)::int +
          ("reported_user_id" IS NOT NULL)::int
        ) = 1
      )
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_post_id_posts_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_comment_id_comments_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_users_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "users"("id") ON DELETE SET NULL;