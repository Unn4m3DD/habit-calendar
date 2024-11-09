import { DateTime } from "luxon";
import DayView from "~/app/_components/DayView";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";
export default async function DayPage({
  params,
}: {
  params: Promise<{ userId: string; day: string }>;
}) {
  const { userId, day } = await params;
  const currentDay = await db.query.days.findFirst({
    where: (fields, { and, eq }) => {
      return and(
        eq(fields.date, DateTime.fromISO(day).toJSDate()),
        eq(fields.userId, userId),
      );
    },
  });
  return <DayView currentDay={currentDay} />;
}
