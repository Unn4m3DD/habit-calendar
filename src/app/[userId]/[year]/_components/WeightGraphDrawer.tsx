"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { ChartColumn, Loader2 } from "lucide-react";
import { DateTime, Duration } from "luxon";
import { useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { getRecordsWithinLast } from "~/app/actions";
import { Button } from "~/components/ui/button";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const chartConfig = {
  weight: {
    label: "weight",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function WeightGraphDrawer({ userId }: { userId: string }) {
  const [durationSelect, setDurationSelect] = useState<string>("P30D");
  const duration = Duration.fromISO(durationSelect);
  const [aggregateBy, setAggregateBy] = useState<"day" | "week" | "month">(
    "day",
  );
  const { data, isLoading } = useQuery({
    queryKey: ["weightGraph", durationSelect],
    queryFn: async () => {
      console.log("querying");
      return getRecordsWithinLast({ userId, durationIso: durationSelect });
    },
  });
  const validDays = data?.map((e) => ({
    day: DateTime.fromJSDate(e.date).valueOf(),
    weight: e.weight,
  }));
  const aggregatedDays = validDays?.reduce(
    (acc, curr) => {
      const day = DateTime.fromMillis(curr.day).startOf(aggregateBy);
      if (!day.isValid) return acc;
      acc[day.toISO()] ??= {
        day: day.valueOf(),
        weight: 0,
        amountOfDays: 0,
      };
      acc[day.toISO()]!.weight += curr.weight!;
      acc[day.toISO()]!.amountOfDays += 1;
      return acc;
    },
    {} as Record<string, { day: number; weight: number; amountOfDays: number }>,
  );
  for (const key in aggregatedDays) {
    aggregatedDays[key]!.weight /= aggregatedDays[key]!.amountOfDays;
    aggregatedDays[key]!.weight =
      Math.round(aggregatedDays[key]!.weight * 100) / 100;
  }
  const [parent] = useAutoAnimate();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="relative flex h-9 w-9 text-sm">
          <ChartColumn />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="gap-4 p-8 pt-0">
        <DrawerTitle>Weight Over Time (Last {duration.toHuman()})</DrawerTitle>
        <DrawerDescription className="flex flex-col gap-2">
          <Select onValueChange={setDurationSelect} value={durationSelect}>
            <SelectTrigger>
              <SelectValue>Last {duration.toHuman()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {[
                Duration.fromObject({ weeks: 1 }),
                Duration.fromObject({ weeks: 2 }),
                Duration.fromObject({ months: 1 }),
                Duration.fromObject({ months: 2 }),
                Duration.fromObject({ months: 3 }),
                Duration.fromObject({ months: 6 }),
                Duration.fromObject({ years: 1 }),
              ].map((e) => (
                <SelectItem key={e.toHuman()} value={e.toISO()}>
                  {e.toHuman()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setAggregateBy as any} value={aggregateBy}>
            <SelectTrigger>
              <SelectValue>
                Aggregate by{" "}
                {aggregateBy.charAt(0).toUpperCase() + aggregateBy.slice(1)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {["day", "week", "month"].map((e) => (
                <SelectItem key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DrawerDescription>
        <div ref={parent} className="flex h-[60vh] flex-col">
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin" />
            </div>
          )}
          {!isLoading && (
            <ChartContainer config={chartConfig} className="min-h-[50vh]">
              <LineChart
                accessibilityLayer
                data={Object.values(aggregatedDays!)}
              >
                <CartesianGrid />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  type="number"
                  allowDecimals={true}
                  tickCount={5}
                />
                <XAxis
                  allowDataOverflow
                  type="number"
                  domain={[
                    DateTime.now().minus(duration).valueOf(),
                    DateTime.now().plus({ day: 1 }).valueOf(),
                  ]}
                  dataKey="day"
                  tickFormatter={(value: number) =>
                    DateTime.fromMillis(value).toLocaleString(DateTime.DATE_MED)
                  }
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="weight"
                  type="monotone"
                  stroke="var(--color-weight)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-weight)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                  connectNulls
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
