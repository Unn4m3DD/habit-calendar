"use server";

import { db } from "~/server/db";
import { days, type DayType } from "~/server/db/schema";
import { DateTime, Duration } from "luxon";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const getUserRecord = async ({
  userId,
  year,
}: {
  userId: string;
  year: string;
}) => {
  const startOfYear = DateTime.fromFormat(year, "yyyy").startOf("year");
  return await db.query.days.findMany({
    where: (fields, { and, between, eq }) => {
      return and(
        eq(fields.userId, userId),
        between(
          fields.date,
          startOfYear.toJSDate(),
          startOfYear.endOf("year").toJSDate(),
        ),
      );
    },
    orderBy: (days, { asc }) => asc(days.date),
  });
};
export const getOrCreateUserRecord = async ({
  userId,
  year,
}: {
  userId: string;
  year: string;
}) => {
  const result = await getUserRecord({ userId, year });
  if (result.length > 0) return result;
  const startOfYear = DateTime.fromFormat(year, "yyyy").startOf("year");
  const amountOfDays = startOfYear.daysInYear;
  await db.insert(days).values(
    new Array(amountOfDays).fill(0).map((_, i) => ({
      userId,
      date: startOfYear.plus({ day: i }).toJSDate(),
      weight: undefined,
      takenSupplements: false,
      trained: false,
      caloriesCounted: false,
      journal: "",
    })),
  );
  return await getUserRecord({ userId, year });
};

export const getRecordsWithinLast = async ({
  userId,
  durationIso,
}: {
  userId: string;
  durationIso: string;
}) => {
  const startDate = DateTime.now()
    .startOf("day")
    .minus(Duration.fromISO(durationIso));
  return await db.query.days.findMany({
    where: (fields, { and, between, eq, isNotNull }) => {
      return and(
        eq(fields.userId, userId),
        between(fields.date, startDate.toJSDate(), DateTime.now().toJSDate()),
        isNotNull(fields.weight),
      );
    },
    orderBy: (days, { asc }) => asc(days.date),
  });
};

export const updateDay = async (day: DayType) => {
  await db.update(days).set(day).where(eq(days.id, day.id));
  revalidatePath(
    `/${day.userId}/${DateTime.fromJSDate(day.date).toFormat("yyyy")}`,
  );
};
