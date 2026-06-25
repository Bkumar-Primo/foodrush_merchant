"use client";

import { useEffect, useState } from "react";
import { PROFILE_COPY } from "@/components/dashboard/constants";
import { updateAuthDisplayName, useAuth } from "@/lib/auth";
import { useDashboardStore } from "@/stores/useDashboardStore";

export function ProfileEditForm(): React.JSX.Element {
  const { displayName, user } = useAuth();
  const setUserProfile = useDashboardStore((state) => state.setUserProfile);
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(displayName);
  }, [displayName]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    try {
      await updateAuthDisplayName(name);
      setUserProfile({
        name: name.trim(),
        avatarUrl: user?.photoURL ?? undefined,
      });
      setMessage(PROFILE_COPY.profileSaved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
      <h4 className="text-md font-medium text-black capitalize tracking-widest">
        {PROFILE_COPY.editTitle}
      </h4>

      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="profile-display-name"
            className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            {PROFILE_COPY.displayNameLabel}
          </label>
          <input
            id="profile-display-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={PROFILE_COPY.displayNamePlaceholder}
            className="h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {user?.email ? (
          <div className="space-y-1.5">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {PROFILE_COPY.emailLabel}
            </p>
            <p className="text-xs text-zinc-700 dark:text-zinc-300">{user.email}</p>
          </div>
        ) : null}

        {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
        {message ? <p className="text-xs font-medium text-emerald-600">{message}</p> : null}

        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-[#B8433A] disabled:opacity-60"
        >
          {saving ? PROFILE_COPY.savingProfile : PROFILE_COPY.saveProfile}
        </button>
      </div>
    </form>
  );
}
