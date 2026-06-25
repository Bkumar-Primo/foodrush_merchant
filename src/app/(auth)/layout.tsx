import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | FoodRush Merchant",
  description: "Sign in to your merchant account",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return <>{children}</>;
}
