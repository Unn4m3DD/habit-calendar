import { DateTime } from "luxon";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const posts = await db.query.posts.findMany();
  return (
    <HydrateClient>
      <main className="flex flex-col items-start justify-start gap-2 bg-slate-800 text-white">
        {JSON.stringify(posts)}
        <form>
          <button
            type="submit"
            onClick={async () => {
              "use server";
              api.post.create({
                name: "test",
              });
            }}
          >
            Create Posts
          </button>
        </form>
        {new Array(12).fill(0).map((_, i) => {
          const month = DateTime.now()?.set({ month: i + 1 });
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
                {new Array(month?.endOf("month")?.day).fill(0).map((_, j) => (
                  <button
                    key={j}
                    className="flex h-9 w-9 flex-col items-center justify-center gap-2 rounded-full bg-slate-700 text-sm text-white"
                  >
                    {j + 1}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </HydrateClient>
  );
}
