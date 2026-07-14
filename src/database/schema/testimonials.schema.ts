import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentName: varchar("parent_name", { length: 255 }).notNull(),
    studentName: varchar("student_name", { length: 255 }).notNull(),
    message: text("message").notNull(),
    rating: integer("rating").default(5).notNull(),
    imageUrl: varchar("image_url", { length: 1000 }),
    imagePublicId: varchar("image_public_id", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
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
  (table) => [
    index("testimonials_active_idx").on(table.isActive),
    index("testimonials_created_at_idx").on(table.createdAt),
    index("testimonials_parent_name_idx").on(table.parentName),
  ]
);