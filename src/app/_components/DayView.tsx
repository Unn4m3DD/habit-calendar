import { DateTime } from "luxon";
import { type db } from "~/server/db";

export default function DayView({
  currentDay,
}: {
  currentDay: Awaited<ReturnType<typeof db.query.days.findFirst>>;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-800 p-4 text-white">
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        Calories:
        {currentDay?.caloriesCounted}
      </div>
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        Weight:
        {currentDay?.weight}
      </div>
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        Journal:
        {currentDay?.journal}
      </div>
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        Supplements:
        {currentDay?.takenSupplements}
      </div>
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        Trained:
        {currentDay?.trained}
      </div>
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        Date:
        {currentDay?.date
          ? DateTime.fromJSDate(currentDay?.date).toLocaleString(
              DateTime.DATETIME_MED,
            )
          : undefined}
      </div>
      <div className="flex w-[32rem] flex-row justify-between gap-4">
        User:
        {currentDay?.userId}
      </div>
    </main>
  );
}
