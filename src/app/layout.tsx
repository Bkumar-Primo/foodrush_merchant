import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { BRAND_METADATA } from "@/lib/constants";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND_METADATA.defaultTitle,
    template: `%s | ${BRAND_METADATA.applicationName}`,
  },
  description: BRAND_METADATA.defaultDescription,
  applicationName: BRAND_METADATA.applicationName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
