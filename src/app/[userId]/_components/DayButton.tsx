"use client";
import { DateTime } from "luxon";
import { useState } from "react";
import DayView from "~/app/_components/DayView";
import { ClientButton } from "~/components/ui/client-button";
import { Drawer, DrawerContent, DrawerTitle } from "~/components/ui/drawer";
import { cn } from "~/lib/utils";
import type { db } from "~/server/db";

export default function DayButton({
  date,
  currentDay,
}: {
  date: Date;
  currentDay: Awaited<ReturnType<typeof db.query.days.findFirst>>;
}) {
  const [isShown, setIsShown] = useState(false);
  return (
    <>
      <ClientButton
        variant="default"
        className="relative flex h-9 w-9 text-sm"
        onClick={
          !currentDay
            ? undefined
            : () => {
                setIsShown(true);
              }
        }
      >
        {DateTime.fromJSDate(date).toFormat("dd")}
        <div
          className={cn("absolute -left-px -top-px size-2 rounded-full", {
            "bg-green-500": currentDay?.takenSupplements,
          })}
        />
        <div
          className={cn("absolute -bottom-px -right-px size-2 rounded-full", {
            "bg-green-500": currentDay?.trained,
          })}
        />
        <div
          className={cn("absolute -right-px -top-px size-2 rounded-full", {
            "bg-green-500": currentDay?.caloriesCounted,
          })}
        />
      </ClientButton>

      <Drawer open={isShown} onOpenChange={setIsShown}>
        <DrawerTitle></DrawerTitle>
        <DrawerContent>
          <DayView currentDay={currentDay} />
        </DrawerContent>
      </Drawer>
    </>
  );
}
