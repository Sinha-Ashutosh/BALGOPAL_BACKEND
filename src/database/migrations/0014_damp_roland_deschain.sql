CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_name" varchar(255) NOT NULL,
	"student_name" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"image_url" varchar(1000),
	"image_public_id" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "testimonials_active_idx" ON "testimonials" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "testimonials_parent_name_idx" ON "testimonials" USING btree ("parent_name");