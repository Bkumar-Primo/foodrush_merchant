"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthCardLoader } from "@/features/auth/components/AuthCardLoader";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { LoginField } from "@/features/auth/components/LoginField";
import { AUTH_CARD_CLASS, AUTH_COPY, AUTH_ROUTES } from "@/features/auth/constants";
import { signUpWithEmail, useAuth } from "@/lib/auth";

export function SignUpPageView(): React.JSX.Element {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(AUTH_ROUTES.dashboard);
    }
  }, [authLoading, user, router]);

  const showForm = !authLoading && !user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password);
      router.replace(AUTH_ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className={AUTH_CARD_CLASS}>
        {showForm ? (
          <>
            <div className="text-center">
              <h1 className="text-[22px] font-medium text-zinc-900">{AUTH_COPY.signUpTitle}</h1>
              <p className="mt-1 text-sm text-zinc-500">{AUTH_COPY.signUpSubtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <LoginField
                id="signup-email"
                label={AUTH_COPY.emailLabel}
                type="email"
                placeholder={AUTH_COPY.emailPlaceholder}
                value={email}
                onChange={setEmail}
                autoComplete="email"
              />
              <LoginField
                id="signup-password"
                label={AUTH_COPY.passwordLabel}
                type="password"
                placeholder={AUTH_COPY.passwordPlaceholder}
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
              {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-[#B8433A] disabled:opacity-60"
              >
                {loading ? AUTH_COPY.creatingAccount : AUTH_COPY.signUpButton}
              </button>
            </form>
            <p className="mt-5 text-center text-sm text-zinc-500">
              {AUTH_COPY.hasAccount}{" "}
              <Link href={AUTH_ROUTES.login} className="font-medium text-primary hover:text-[#B8433A]">
                {AUTH_COPY.signInLink}
              </Link>
            </p>
          </>
        ) : (
          <AuthCardLoader />
        )}
      </div>
    </AuthSplitLayout>
  );
}
