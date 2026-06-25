"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { LoginField } from "@/features/auth/components/LoginField";
import { AUTH_CARD_CLASS, AUTH_COPY, AUTH_ROUTES } from "@/features/auth/constants";
import { sendPasswordReset } from "@/lib/auth";

export function ForgotPasswordPageView(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <div className={AUTH_CARD_CLASS}>
        <div className="text-center">
          <h1 className="text-[22px] font-medium text-zinc-900">{AUTH_COPY.forgotTitle}</h1>
          <p className="mt-1 text-sm text-zinc-500">{AUTH_COPY.forgotSubtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <LoginField
            id="reset-email"
            label={AUTH_COPY.emailLabel}
            type="email"
            placeholder={AUTH_COPY.emailPlaceholder}
            value={email}
            onChange={setEmail}
            autoComplete="email"
          />
          {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
          {success ? (
            <p className="text-xs font-medium text-emerald-600">{AUTH_COPY.resetSent}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-[#B8433A] disabled:opacity-60"
          >
            {AUTH_COPY.sendReset}
          </button>
        </form>
        <p className="mt-5 text-center text-sm">
          <Link href={AUTH_ROUTES.login} className="font-medium text-primary hover:text-[#B8433A]">
            {AUTH_COPY.backToSignIn}
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
