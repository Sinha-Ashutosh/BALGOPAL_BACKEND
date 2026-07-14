import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// Enforced at the DB level so invalid statuses can never be inserted,
// whether the write comes from this app, a script, or a DB console.
export const admissionStatusEnum = pgEnum("admission_status", [
  "pending",
  "reviewing",
  "waitlisted",
  "approved",
  "rejected",
  "enrolled",
]);

export const admissions = pgTable(
  "admissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentName: varchar("parent_name", {
      length: 255,
    }).notNull(),
    phone: varchar("phone", {
      length: 20,
    }).notNull(),
    email: varchar("email", {
      length: 255,
    }).notNull(),
    childName: varchar("child_name", {
      length: 255,
    }).notNull(),
    // Kept as varchar for flexibility ("18 months", "3.5 years").
    // Switch to integer (months or years) if you need numeric sort/filter.
    childAge: varchar("child_age", {
      length: 20,
    }).notNull(),
    message: text("message"),
    status: admissionStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
    // $onUpdate ensures this actually changes on every UPDATE statement.
    // Without it, defaultNow() only fires once, at insert time.
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("admissions_status_idx").on(table.status),
    index("admissions_parent_name_idx").on(table.parentName),
    index("admissions_created_at_idx").on(table.createdAt),
    index("admissions_email_idx").on(table.email),
  ]
);

export type Admission = typeof admissions.$inferSelect;
export type NewAdmission = typeof admissions.$inferInsert;