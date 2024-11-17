"use client";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import * as uuid from "uuid";

export function ValidateUserId({ userId }: { userId: string }) {
  if (!uuid.validate(userId)) {
    toast("Invalid user id", { id: userId });
    redirect("/");
  }
  return <></>;
}
