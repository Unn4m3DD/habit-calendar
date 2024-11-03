import { sql } from "drizzle-orm";
import {
  boolean,
  char,
  index,
  integer,
  pgTableCreator,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `habit-calendar_${name}`);

export const days = createTable(
  "day",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    userId: uuid("user_id").notNull(),
    date: timestamp("date").unique().notNull(),
    weight: real("weight").notNull(),
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
  (example) => ({
    dateIndex: index("name_idx").on(example.date),
  }),
);
