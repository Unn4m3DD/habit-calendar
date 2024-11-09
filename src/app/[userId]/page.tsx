import { DateTime } from "luxon";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import DayButton from "./_components/DayButton";
import { ValidateUserId } from "./_components/ValidateUserId";

export const dynamic = "force-dynamic";
export default async function Home({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const myDays = await db.query.days.findMany({
    where: (fields, { and, between, eq }) => {
      return and(
        between(
          fields.date,
          DateTime.now().startOf("year").toJSDate(),
          DateTime.now().endOf("year").toJSDate(),
        ),
        eq(fields.userId, userId),
      );
    },
  });
  return (
    <>
      <ValidateUserId userId={userId} />
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-slate-800 p-4 text-white">
        <Button asChild>
          <Link href="/" className="flex text-sm">
            Logout
          </Link>
        </Button>
        <div className="flex min-h-full flex-col gap-2">
          {new Array(12).fill(0).map((_, i) => {
            const month = DateTime.now()
              .startOf("day")
              ?.set({ month: i + 1 });
            return (
              <div className="flex flex-col items-start gap-1" key={i}>
                <div className="flex flex-col items-center justify-center gap-2">
                  {
                    month
                      .toLocaleParts({ month: "long" })
                      .find((e) => e.type === "month")?.value
                  }
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                  {new Array(month?.endOf("month")?.day).fill(0).map((_, j) => {
                    const date = month?.plus({ day: j });
                    const jsDate = date?.toJSDate();
                    const currentDay = myDays.find(
                      (e) =>
                        DateTime.fromJSDate(e.date).toISODate() ===
                        date?.toISODate(),
                    );
                    return (
                      <DayButton
                        key={j}
                        date={jsDate}
                        currentDay={currentDay}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
