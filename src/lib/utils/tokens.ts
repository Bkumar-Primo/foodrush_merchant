// Tailwind v4 Theme Tokens — only values reused across the app

export const tokens = {
  fontSizes: {
    title: "text-2xl font-medium tracking-tight",
    subtitle: "text-sm font-medium tracking-tight",
    heading: "text-lg font-medium",
    cardTitle: "text-sm font-medium",
    bodyBold: "text-xs font-medium",
    bodySemibold: "text-xs font-medium",
    bodyMono: "text-[11px] font-medium font-mono",
    body: "text-xs font-medium",
    caption: "text-[11px] font-medium",
    micro: "text-[10.5px] font-medium",
    muted: "text-[10px] font-medium uppercase tracking-widest",
    small: "text-[10px]",
    fieldLabel: "text-[10px] font-medium text-zinc-550 dark:text-zinc-450 uppercase tracking-wider",
  },

  colors: {
    // Brand (FoodRush blue)
    brand: "text-[#2563EB]",
    brandBg: "bg-[#2563EB]",
    brandBgHover: "hover:bg-[#1D4ED8]",
    brandBorder: "border-[#2563EB]",
    brandRing: "focus:ring-[#2563EB]",
    brandBgLight: "bg-blue-50/40 dark:bg-indigo-950/20",

    // Order actions (Zomato-style blue)
    orderAction: "bg-[#185adb]",
    orderActionHover: "hover:bg-[#1146ad]",
    orderActionText: "text-[#185adb]",
    orderActionBorder: "border-[#185adb]",
    orderActionOutlineHover: "hover:bg-blue-50/50",

    // Primary (Indigo)
    primaryBg: "bg-indigo-600",
    primaryBgHover: "hover:bg-indigo-500",
    primaryText: "text-indigo-600 dark:text-indigo-400",
    primaryBorder: "border-indigo-600 dark:border-indigo-400",
    primaryShadow: "shadow-indigo-600/15",

    successBg: "bg-emerald-500",
    successBgLight: "bg-emerald-50/50 dark:bg-emerald-950/20",
    successText: "text-emerald-500 dark:text-emerald-400",
    successBorder: "border-emerald-200 dark:border-emerald-950",

    warningBg: "bg-amber-500",
    warningBgLight: "bg-amber-50/50 dark:bg-amber-950/20",
    warningText: "text-amber-500 dark:text-amber-400",
    warningBorder: "border-amber-200 dark:border-amber-950",

    dangerBg: "bg-rose-500",
    dangerBgHover: "hover:bg-rose-600",
    dangerBgLight: "bg-rose-50/50 dark:bg-rose-950/20",
    dangerText: "text-rose-500 dark:text-rose-400",
    dangerBorder: "border-rose-200 dark:border-rose-950",

    infoBg: "bg-sky-500",
    infoBgLight: "bg-sky-50/50 dark:bg-sky-950/20",
    infoText: "text-sky-500 dark:text-sky-400",
    infoBorder: "border-sky-200 dark:border-sky-950",

    pageBg: "bg-zinc-50 dark:bg-zinc-950",
    cardBg: "bg-white dark:bg-zinc-900",
    cardBgMuted: "bg-zinc-50/50 dark:bg-zinc-900/40",
    sidebarBg: "bg-white/70 dark:bg-zinc-900/40",
    headerBg: "bg-white/50 dark:bg-zinc-900/20",

    border: "border-zinc-200/60 dark:border-zinc-800",
    borderHeavy: "border-zinc-200 dark:border-zinc-800",
    borderMuted: "border-zinc-100 dark:border-zinc-800",

    textPrimary: "text-zinc-950 dark:text-zinc-50",
    textSecondary: "text-zinc-700 dark:text-zinc-300",
    textMuted: "text-zinc-500 dark:text-zinc-400",

    input:
      "w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 px-3 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#2563EB]",
  },
};
