"use client";
import { DateTime } from "luxon";
import { updateDay } from "~/app/actions";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { cn } from "~/lib/utils";
import { type DayType } from "~/server/db/schema";
import { Input } from "~/components/ui/input";
import { useOptimistic, useRef, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function DayButton({ currentDay }: { currentDay: DayType }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticState, updateOptimistic] = useOptimistic(currentDay);
  const updateDayMutation = <T extends keyof DayType>(
    key: T,
    newValue: DayType[T],
  ) => {
    startTransition(async () => {
      const newDay = {
        ...optimisticState,
        [key]: newValue,
      };
      updateOptimistic(newDay);
      await updateDay(newDay);
    });
  };
  const autoSubmitTimeout = useRef<ReturnType<typeof setTimeout>>();

  const now = DateTime.now().startOf("day");
  const isToday =
    DateTime.fromJSDate(optimisticState.date).ordinal === now.ordinal;
  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            ref={(ref) => {
              if (isToday) {
                ref?.scrollIntoView({
                  behavior: "smooth",
                });
              }
            }}
            variant={isToday ? "default" : "outline"}
            className="relative flex h-9 w-9 text-sm"
          >
            {DateTime.fromJSDate(optimisticState.date)?.toFormat("dd")}
            <div
              className={cn("absolute -left-1 -top-1 size-2 rounded-full", {
                "bg-green-500": optimisticState.takenSupplements,
              })}
            />
            <div
              className={cn("absolute -bottom-1 -right-1 size-2 rounded-full", {
                "bg-green-500": optimisticState.trained,
              })}
            />
            <div
              className={cn("absolute -right-1 -top-1 size-2 rounded-full", {
                "bg-green-500": optimisticState.caloriesCounted,
              })}
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto flex w-full max-w-sm flex-col gap-6 py-8 px-6">
            <DrawerHeader>
              <DrawerTitle className="flex flex-row items-center gap-2">
                {DateTime.fromJSDate(optimisticState.date)?.toLocaleString(
                  DateTime.DATE_FULL,
                )}
                {isPending && <Loader2 className="size-4 animate-spin" />}
              </DrawerTitle>
              <DrawerDescription>
                {`${
                  (optimisticState.caloriesCounted ? 1 : 0) +
                  (optimisticState.takenSupplements ? 1 : 0) +
                  (optimisticState.trained ? 1 : 0)
                }`}
                /3
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col justify-between gap-2">
              {(
                [
                  {
                    key: "caloriesCounted",
                    label: "Calories Counted",
                  },
                  {
                    key: "takenSupplements",
                    label: "Supplements",
                  },
                  {
                    key: "trained",
                    label: "Trained",
                  },
                ] as const
              ).map((e) => {
                return (
                  <div className="flex items-center space-x-2" key={e.key}>
                    <Checkbox
                      onCheckedChange={() => {
                        updateDayMutation(e.key, !optimisticState[e.key]);
                      }}
                      checked={optimisticState[e.key]}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {e.label}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-between gap-2">
              <Label>Weight:</Label>
              <Input
                type="number"
                defaultValue={optimisticState.weight ?? undefined}
                onBlur={(e) => {
                  updateDayMutation(
                    "weight",
                    e.target.value ? Number(e.target.value) : null,
                  );
                }}
                onChange={(e) => {
                  clearTimeout(autoSubmitTimeout.current);
                  autoSubmitTimeout.current = setTimeout(() => {
                    updateDayMutation(
                      "weight",
                      e.target.value ? Number(e.target.value) : null,
                    );
                  }, 5000);
                }}
              />
            </div>
            <div className="flex flex-col justify-between gap-2">
              <Label>Journal:</Label>
              <Textarea
                className="h-32"
                defaultValue={optimisticState.journal ?? undefined}
                onBlur={(e) => {
                  updateDayMutation("journal", e.target.value);
                }}
                onChange={(e) => {
                  clearTimeout(autoSubmitTimeout.current);
                  autoSubmitTimeout.current = setTimeout(() => {
                    updateDayMutation("journal", e.target.value);
                  }, 5000);
                }}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
