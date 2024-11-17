import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  real,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import type { db } from ".";

export const createTable = pgTableCreator((name) => `habit-calendar_${name}`);

export const days = createTable(
  "day",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: uuid("user_id").notNull(),
    date: timestamp("date").notNull(),
    weight: real("weight"),
    takenSupplements: boolean("taken_supplements").notNull(),
    trained: boolean("trained").notNull(),
    caloriesCounted: boolean("calories_counted").notNull(),
    journal: text("journal").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => ({
    dateIndex: index("date_idx").on(t.date),
    userIdIndex: index("user_id_idx").on(t.userId),
    oneDatePerUser: unique("one_date_per_user").on(t.userId, t.date),
  }),
);
export type DayType = NonNullable<
  Awaited<ReturnType<typeof db.query.days.findFirst>>
>;
