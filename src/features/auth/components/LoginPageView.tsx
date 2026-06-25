"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthHeroImage } from "@/features/auth/components/AuthHeroImage";
import { LoginForm } from "@/features/auth/components/LoginForm";
import {
  AUTH_CARD_CLASS,
  AUTH_COPY,
  AUTH_PAGE_BG,
  AUTH_ROUTES,
  AUTH_SPLIT_CONTENT_CLASS,
  AUTH_SPLIT_LEFT_CLASS,
  AUTH_SPLIT_MAIN_CLASS,
  AUTH_SPLIT_RIGHT_CLASS,
} from "@/features/auth/constants";
import { BRAND_ASSETS } from "@/lib/constants";
import { useAuth } from "@/lib/auth";

export function LoginPageView(): React.JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace(AUTH_ROUTES.dashboard);
    }
  }, [loading, user, router]);

  if (loading || user) {
    return <div className="h-dvh" style={{ backgroundColor: AUTH_PAGE_BG }} />;
  }

  return (
    <main className={AUTH_SPLIT_MAIN_CLASS} style={{ backgroundColor: AUTH_PAGE_BG }}>
      <div className={AUTH_SPLIT_CONTENT_CLASS}>
        <section className={AUTH_SPLIT_LEFT_CLASS}>
          <div className={AUTH_CARD_CLASS}>
            <div className="flex justify-start">
              <Image
                src={BRAND_ASSETS.logo}
                alt="FoodRush"
                width={150}
                height={150}
                className="shrink-0 object-contain"
                priority
              />
            </div>

            <div className="mt-3">
              <h1 className="text-[22px] font-medium leading-tight text-zinc-900">
                {AUTH_COPY.welcomeTitle}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">{AUTH_COPY.welcomeSubtitle}</p>
            </div>

            <LoginForm />
          </div>
        </section>

        <aside className={AUTH_SPLIT_RIGHT_CLASS}>
          <AuthHeroImage />
        </aside>
      </div>
    </main>
  );
}
