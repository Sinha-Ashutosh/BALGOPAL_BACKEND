CREATE TABLE "website_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_name" varchar(150) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"about" text NOT NULL,
	"hero_title" varchar(255) NOT NULL,
	"hero_subtitle" text NOT NULL,
	"school_timings" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
