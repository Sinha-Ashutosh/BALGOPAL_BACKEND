CREATE TYPE "public"."admission_status" AS ENUM('pending', 'reviewing', 'waitlisted', 'approved', 'rejected', 'enrolled');--> statement-breakpoint
CREATE TABLE "admissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"child_name" varchar(255) NOT NULL,
	"child_age" varchar(20) NOT NULL,
	"message" text,
	"status" "admission_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "admissions_status_idx" ON "admissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "admissions_parent_name_idx" ON "admissions" USING btree ("parent_name");--> statement-breakpoint
CREATE INDEX "admissions_created_at_idx" ON "admissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admissions_email_idx" ON "admissions" USING btree ("email");