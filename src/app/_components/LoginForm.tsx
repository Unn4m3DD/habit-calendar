"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import * as uuid from "uuid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { cn } from "~/lib/utils";
import Link from "next/link";

const loginSchema = z.object({
  userId: z.string().uuid("Invalid user id"),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
    },
    mode: "all",
  });
  function onSubmit(values: z.infer<typeof loginSchema>) {
    router.push(`/${values.userId}`);
  }
  const [parent] = useAutoAnimate();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8">
      <Form {...form}>
        <form
          ref={parent}
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-y-4 transition-all"
        >
          <div className="flex w-full flex-col items-center gap-2">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>User id</FormLabel>
                  <FormControl>
                    <Input placeholder="Insert your user Id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              name="userId"
              control={form.control}
              render={({ field, formState }) =>
                formState.isValid ? (
                  <Button type="submit" asChild>
                    <Link prefetch={true} href={`/${field.value}`}>
                      Login
                    </Link>
                  </Button>
                ) : (
                  <Button type="submit">Login</Button>
                )
              }
            />
          </div>
          <Controller
            name="userId"
            control={form.control}
            render={({ field, formState }) => (
              <div
                className={cn(
                  "flex flex-col items-center gap-2 transition-opacity duration-200",
                  {
                    "opacity-0": formState.isValid,
                  },
                )}
              >
                <h2>Don&apos;t have a user id yet?</h2>
                <Button
                  type="button"
                  onClick={() => {
                    field.onChange(uuid.v4());
                  }}
                >
                  Create a new one
                </Button>
              </div>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
