import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const websiteSettings = pgTable("website_settings", {
  id: uuid("id").defaultRandom().primaryKey(),

  schoolName: varchar("school_name", {
    length: 150,
  }).notNull(),

  phone: varchar("phone", {
    length: 20,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull(),

  address: text("address").notNull(),

  about: text("about").notNull(),

  heroTitle: varchar("hero_title", {
    length: 255,
  }).notNull(),

  heroSubtitle: text("hero_subtitle").notNull(),

  schoolTimings: varchar("school_timings", {
    length: 255,
  }),
  
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});