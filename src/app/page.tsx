import LoginForm from "./_components/LoginForm";

export default async function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-[min(calc(100vw-1rem),22rem)] flex-col items-center justify-center gap-10">
        <h1 className="text-4xl font-bold">Habit Calendar</h1>
        <LoginForm />
      </div>
    </main>
  );
}
