"use client";

import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { AUTH_COPY } from "@/features/auth/constants";

interface LoginFieldProps {
  id: string;
  label: string;
  type: "email" | "password";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

export function LoginField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
}: LoginFieldProps): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-800">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
          {isPassword ? <Lock className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
        </span>
        <input
          id={id}
          type={isPassword && !showPassword ? "password" : isPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function LoginRememberRow({
  rememberMe,
  onRememberMeChange,
  forgotHref,
}: {
  rememberMe: boolean;
  onRememberMeChange: (checked: boolean) => void;
  forgotHref: string;
}): React.JSX.Element {
  return (
    <div className="flex items-center justify-between text-sm">
      <label className="flex items-center gap-2 text-zinc-600 cursor-pointer">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => onRememberMeChange(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-300 accent-primary focus:ring-primary/30"
        />
        {AUTH_COPY.rememberMe}
      </label>
      <Link href={forgotHref} className="font-medium text-primary hover:text-[#B8433A]">
        {AUTH_COPY.forgotPassword}
      </Link>
    </div>
  );
}
