import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const gallery = pgTable(
  "gallery",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    imageUrl: varchar("image_url", { length: 1000 }).notNull(),
    imagePublicId: varchar("image_public_id", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
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
  },
    (t) => [
    index("gallery_category_idx").on(t.category),
  ]
);