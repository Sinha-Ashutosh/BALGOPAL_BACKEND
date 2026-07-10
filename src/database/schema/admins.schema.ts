import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./Roles.Schema";

export const admins = pgTable(
  "admins",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    })
      .notNull()
      .unique(),

    password: text("password").notNull(),

    phone: varchar("phone", {
      length: 15,
    }),

    profileImage: text("profile_image"),

    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),

    isActive: boolean("is_active")
      .default(true)
      .notNull(),

    lastLogin: timestamp("last_login", {
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
  (table) => ({
    roleIdIdx: index("admins_role_id_idx").on(table.roleId),
  })
);

export const adminsRelations = relations(admins, ({ one }) => ({
  role: one(roles, {
    fields: [admins.roleId],
    references: [roles.id],
  }),
}));