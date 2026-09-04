CREATE TYPE "user_role" AS ENUM('ADMIN', 'USER', 'AUTHOR');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text UNIQUE,
	"phone" text UNIQUE,
	"username" varchar(50) NOT NULL UNIQUE,
	"password_hash" text,
	"display_name" varchar(50) NOT NULL,
	"avatar_url" text,
	"bio" text,
	"role" "user_role" DEFAULT 'USER'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"email_verified_at" timestamp,
	"phone_verified_at" timestamp
);
