// Tailwind v4 Theme Tokens

export const tokens = {
  // Font Sizes
  fontSizes: {
    title: "text-2xl font-extrabold tracking-tight",
    subtitle: "text-sm font-extrabold tracking-tight",
    heading: "text-lg font-bold",
    cardTitle: "text-sm font-bold",
    bodyBold: "text-xs font-extrabold",
    bodySemibold: "text-xs font-bold",
    bodyMono: "text-[11px] font-semibold font-mono",
    body: "text-xs font-medium",
    muted: "text-[10px] font-bold uppercase tracking-widest",
    small: "text-[10px]",
  },

  // Interactive/Component Colors
  colors: {
    // Brand/Primary (Indigo)
    primaryBg: "bg-indigo-600",
    primaryBgHover: "hover:bg-indigo-500",
    primaryText: "text-indigo-600 dark:text-indigo-400",
    primaryBorder: "border-indigo-600 dark:border-indigo-400",
    primaryShadow: "shadow-indigo-600/15",

    // Success (Emerald)
    successBg: "bg-emerald-500",
    successBgLight: "bg-emerald-50/50 dark:bg-emerald-950/20",
    successText: "text-emerald-500 dark:text-emerald-400",
    successBorder: "border-emerald-200 dark:border-emerald-950",

    // Warning (Amber)
    warningBg: "bg-amber-500",
    warningBgLight: "bg-amber-50/50 dark:bg-amber-950/20",
    warningText: "text-amber-500 dark:text-amber-400",
    warningBorder: "border-amber-200 dark:border-amber-950",

    // Danger (Rose)
    dangerBg: "bg-rose-500",
    dangerBgHover: "hover:bg-rose-600",
    dangerBgLight: "bg-rose-50/50 dark:bg-rose-950/20",
    dangerText: "text-rose-500 dark:text-rose-400",
    dangerBorder: "border-rose-200 dark:border-rose-950",

    // Info (Sky/Cyan)
    infoBg: "bg-sky-500",
    infoBgLight: "bg-sky-50/50 dark:bg-sky-950/20",
    infoText: "text-sky-500 dark:text-sky-400",
    infoBorder: "border-sky-200 dark:border-sky-950",

    // Layout
    pageBg: "bg-zinc-50 dark:bg-zinc-950",
    cardBg: "bg-white dark:bg-zinc-900",
    cardBgMuted: "bg-zinc-50/50 dark:bg-zinc-900/40",
    sidebarBg: "bg-white/70 dark:bg-zinc-900/40",
    headerBg: "bg-white/50 dark:bg-zinc-900/20",

    // Borders
    border: "border-zinc-200/60 dark:border-zinc-800",
    borderHeavy: "border-zinc-200 dark:border-zinc-800",
    borderMuted: "border-zinc-100 dark:border-zinc-800",

    // Text
    textPrimary: "text-zinc-950 dark:text-zinc-50",
    textSecondary: "text-zinc-700 dark:text-zinc-300",
    textMuted: "text-zinc-500 dark:text-zinc-400",
  },
};
