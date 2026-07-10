import { relations } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { admins } from "./admins.schema.js";

export const refreshTokens = pgTable(
  "refresh_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    adminId: uuid("admin_id")
      .notNull()
      .references(() => admins.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    tokenHash: text("token_hash")
      .notNull()
      .unique(),

    userAgent: text("user_agent"),

    ipAddress: varchar("ip_address", {
      length: 45,
    }),

    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    lastUsedAt: timestamp("last_used_at", {
      withTimezone: true,
      mode: "date",
    }),

    revokedAt: timestamp("revoked_at", {
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
    adminIdIdx: index("refresh_tokens_admin_id_idx").on(table.adminId),
  })
);

export const refreshTokensRelations = relations(
  refreshTokens,
  ({ one }) => ({
    admin: one(admins, {
      fields: [refreshTokens.adminId],
      references: [admins.id],
    }),
  })
);