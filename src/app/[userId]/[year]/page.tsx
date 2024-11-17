import { DateTime } from "luxon";
import { getOrCreateUserRecord } from "~/app/actions";
import { LoadedHome } from "./_components/LoadedHome";

export const dynamic = "force-dynamic";
export default async function Home({
  params,
}: {
  params: Promise<{ userId: string; year: string }>;
}) {
  const { userId, year } = await params;
  const days = await getOrCreateUserRecord({ userId, year });
  const startOfYear = DateTime.fromFormat(year, "yyyy").startOf("year");
  return <LoadedHome year={year} days={days} startOfYear={startOfYear} />;
}
