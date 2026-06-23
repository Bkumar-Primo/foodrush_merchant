import Link from "next/link";
import { tokens } from "@/lib/utils";

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm text-center space-y-4">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">Merchant Login</h1>
      <p className="text-sm text-zinc-500">
        Authentication is not wired yet. Use the dashboard directly.
      </p>
      <Link
        href="/"
        className={`inline-block text-sm font-medium hover:underline ${tokens.colors.brand}`}
      >
        Go to dashboard
      </Link>
    </div>
  );
}
