import type { Metadata } from "next";
import { BRAND_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: BRAND_METADATA.authTitle,
  description: BRAND_METADATA.authDescription,
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps): React.JSX.Element {
  return <>{children}</>;
}
