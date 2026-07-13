CREATE TABLE "gallery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"image_url" varchar(1000) NOT NULL,
	"image_public_id" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "gallery_category_idx" ON "gallery" USING btree ("category");