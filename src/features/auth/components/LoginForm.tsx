"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginField, LoginRememberRow } from "@/features/auth/components/LoginField";
import { LoginSocialButtons } from "@/features/auth/components/LoginSocialButtons";
import { AUTH_COPY, AUTH_ROUTES } from "@/features/auth/constants";
import { signInWithApple, signInWithEmail, signInWithGoogle } from "@/lib/auth";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps): React.JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password, rememberMe);
      onSuccess?.();
      router.replace(AUTH_ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "apple") => {
    setError(null);
    setLoading(true);
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
      onSuccess?.();
      router.replace(AUTH_ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Social sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <LoginField
          id="email"
          label={AUTH_COPY.emailLabel}
          type="email"
          placeholder={AUTH_COPY.emailPlaceholder}
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <LoginField
          id="password"
          label={AUTH_COPY.passwordLabel}
          type="password"
          placeholder={AUTH_COPY.passwordPlaceholder}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <LoginRememberRow
          rememberMe={rememberMe}
          onRememberMeChange={setRememberMe}
          forgotHref={AUTH_ROUTES.forgotPassword}
        />

        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-[#B8433A] disabled:opacity-60"
        >
          {loading ? AUTH_COPY.signingIn : AUTH_COPY.signIn}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs text-zinc-400">{AUTH_COPY.orContinueWith}</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <LoginSocialButtons
        disabled={loading}
        onGoogle={() => void handleSocial("google")}
        onApple={() => void handleSocial("apple")}
      />

      <p className="mt-5 text-center text-sm text-zinc-500">
        {AUTH_COPY.noAccount}{" "}
        <Link href={AUTH_ROUTES.signup} className="font-medium text-primary hover:text-[#B8433A]">
          {AUTH_COPY.signUp}
        </Link>
      </p>
    </>
  );
}
