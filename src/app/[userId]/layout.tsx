import { ValidateUserId } from "./_components/ValidateUserId";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
}) {
  const { userId } = await params;
  return (
    <>
      <ValidateUserId userId={userId} />
      {children}
    </>
  );
}
