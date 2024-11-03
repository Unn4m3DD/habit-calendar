import { DateTime } from "luxon";
import { db } from "~/server/db";
import { days } from "~/server/db/schema";
import { HydrateClient } from "~/trpc/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function Home({ params: { uuid } }: { params: { uuid: string } }) {
  const myDays = await db.query.days.findMany({
    where: (fields, { between }) => {
      return between(
        fields.date,
        DateTime.now().startOf("year").toJSDate(),
        DateTime.now().endOf("year").toJSDate(),
      );
    },
  });
  return (
    <HydrateClient>
      <main className="flex flex-col items-start justify-start gap-2 bg-slate-800 text-white">
        {uuid}
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
                  return (
                    <button
                      key={j}
                      className="flex h-9 w-9 flex-col items-center justify-center gap-2 rounded-full bg-slate-700 text-sm text-white"
                      onClick={async () => {
                        "use server";
                        await db.insert(days).values({
                          userId: uuidv4(),
                          date: jsDate,
                          weight: 0,
                          takenSupplements: false,
                          trained: false,
                          caloriesCounted: false,
                          journal: "",
                        });
                        revalidatePath("/");
                      }}
                    >
                      {j + 1}
                      {
                        myDays.find(
                          (e) =>
                            DateTime.fromJSDate(e.date).toISODate() ===
                            date?.toISODate(),
                        )?.id
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </HydrateClient>
  );
}
