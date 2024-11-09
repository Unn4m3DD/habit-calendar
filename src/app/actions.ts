"use server";

import { db } from "~/server/db";
import { days } from "~/server/db/schema";
import { revalidatePath } from "next/cache";

export const createRandomDayRecord = async (date: Date, userId: string) => {
  "use server";
  await db.insert(days).values({
    userId,
    date: date,
    weight: 0,
    takenSupplements: Math.random() > 0.5,
    trained: Math.random() > 0.5,
    caloriesCounted: Math.random() > 0.5,
    journal: "",
  });
  revalidatePath(`/${userId}`);
};
