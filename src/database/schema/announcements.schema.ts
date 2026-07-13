import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    // Scheduling — both optional. If null, treat as "no scheduling constraint"
    // (publishAt null = visible immediately once isActive; expiresAt null = never expires).
    publishAt: timestamp("publish_at", {
      withTimezone: true,
      mode: "date",
    }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
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
  },
  (table) => [
  index("announcements_active_idx").on(table.isActive),
  index("announcements_created_at_idx").on(table.createdAt),
  index("announcements_publish_at_idx").on(table.publishAt),
  index("announcements_expires_at_idx").on(table.expiresAt),
]
);