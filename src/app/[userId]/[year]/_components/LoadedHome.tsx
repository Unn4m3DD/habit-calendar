import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { type DayType } from "~/server/db/schema";
import DayButton from "./DayButton";
import { ThemeToggle } from "~/app/_components/ThemeToggle";
import { ScrollArea } from "~/components/ui/scroll-area";
import WeightGraphDrawer from "./WeightGraphDrawer";

type LoadedHomeProps = {
  userId: string;
  year: string;
  days: DayType[];
  startOfYear: DateTime;
};

export function LoadedHome(
  params:
    | ({ isLoading?: false } & LoadedHomeProps)
    | ({ isLoading: true } & Partial<LoadedHomeProps>),
) {
  const { year, days, isLoading, userId } = params;
  const startOfYear = !isLoading
    ? params.startOfYear
    : DateTime.fromFormat("2022", "yyyy").startOf("year");
  return (
    <main className="flex h-full max-w-fit flex-col items-center justify-center gap-4">
      <div className="flex w-full flex-row flex-wrap items-center justify-between gap-2 p-4 pb-0">
        <div className="flex flex-row items-center justify-center gap-2">
          <Button asChild variant="outline">
            <Link href={`${Number(year) - 1}`} className="flex text-sm">
              <ArrowLeft className="h-6 w-6" />
            </Link>
          </Button>
          <div className="flex w-16 items-center justify-center text-lg font-bold">
            {isLoading && <Loader2 className="h-6 w-6 animate-spin" />}
            {!isLoading && year}
          </div>
          <Button asChild variant="outline">
            <Link href={`${Number(year) + 1}`} className="flex text-sm">
              <ArrowRight className="h-6 w-6" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2">
          {userId && <WeightGraphDrawer userId={userId} />}
          <ThemeToggle />
          <Button asChild>
            <Link href="/" className="flex text-sm">
              Logout
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative flex h-full w-full overflow-hidden">
        <ScrollArea className="absolute inset-0">
          <div className="flex flex-col gap-2 p-4">
            {new Array(12).fill(0).map((_, i) => {
              const month = startOfYear.set({ month: i + 1 });
              const offset = month.weekday - 1;
              return (
                <div className="flex flex-col items-start gap-1" key={i}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    {
                      month
                        .toLocaleParts({ month: "long" })
                        .find((e) => e.type === "month")?.value
                    }
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-start gap-2">
                    {new Array(offset).fill(0).map((_, j) => {
                      return (
                        <Button
                          key={-j}
                          variant="outline"
                          className="relative flex h-9 w-9 text-sm sm:hidden"
                          disabled
                        ></Button>
                      );
                    })}
                    {new Array(month?.endOf("month")?.day)
                      .fill(0)
                      .map((_, j) => {
                        const currentDate = month?.plus({ day: j });
                        if (!isLoading) {
                          return (
                            <DayButton
                              key={j}
                              currentDay={days[currentDate.ordinal - 1]!}
                            />
                          );
                        } else {
                          return (
                            <Button
                              key={j}
                              variant="outline"
                              className="relative flex h-9 w-9 text-sm"
                            >
                              {currentDate?.toFormat("dd")}
                            </Button>
                          );
                        }
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
