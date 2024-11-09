import { Loader2 } from "lucide-react";

export default async function LoadingHome() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>
  );
}
