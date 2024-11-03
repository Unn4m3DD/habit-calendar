import { HydrateClient } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen items-center justify-center bg-slate-800 text-white">
        <div className="flex max-w-[32rem] flex-col items-center justify-center gap-2">
          <h1 className="text-4xl font-bold">Habit Calendar</h1>
          <p className="flex items-center text-2xl text-center">
            A habit tracking app that helps you keep track of your habits and
            progress.
          </p>
          <h2>Enter your user id</h2>
          <input
            type="text"
            placeholder="Enter your user id"
            className="w-full rounded-full px-4 py-2 text-black"
          />
          <button
            type="submit"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          >
            Login
          </button>
          <h2>Or</h2>
          <button
            type="submit"
            className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          >
            Create a new one
          </button>
        </div>
      </main>
    </HydrateClient>
  );
}
