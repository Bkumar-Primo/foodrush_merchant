import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | Delivrn Merchant",
  description: "Sign in to your merchant account",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
