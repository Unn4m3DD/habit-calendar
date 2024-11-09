"use client";
import React, { useTransition } from "react";
import { type ButtonProps, buttonVariants } from "./button";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "~/lib/utils";
import { Loader2 } from "lucide-react";

type ClientButtonProps = Omit<ButtonProps, "onClick"> & {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};
export const ClientButton = React.forwardRef<
  HTMLButtonElement,
  ClientButtonProps
>(({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const [isPending, startTransition] = useTransition();
  return (
    <Comp
      type="submit"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      onClick={(e) => {
        const result = onClick?.(e);
        if (result instanceof Promise) {
          startTransition(() => {
            return result;
          });
        }
      }}
      {...props}
      {...(isPending
        ? {
            children: <Loader2 className="animate-spin" />,
          }
        : {})}
    />
  );
});
ClientButton.displayName = "ClientButton";
