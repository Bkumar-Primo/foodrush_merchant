// Tailwind v4 Theme Tokens — only values reused across the app
// Colors match BRAND_COLORS / customer app src/theme/colors.ts

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
    // Brand (FoodRush coral)
    brand: "text-[#D4543C]",
    brandBg: "bg-[#D4543C]",
    brandBgHover: "hover:bg-[#B8433A]",
    brandBorder: "border-[#D4543C]",
    brandRing: "focus:ring-[#D4543C]",
    brandBgLight: "bg-[#F4A99A]/25 dark:bg-[#D4543C]/15",

    // Order actions (brand primary)
    orderAction: "bg-[#D4543C]",
    orderActionHover: "hover:bg-[#B8433A]",
    orderActionText: "text-[#D4543C]",
    orderActionBorder: "border-[#D4543C]",
    orderActionOutlineHover: "hover:bg-[#F4A99A]/20",

    // Primary accents
    primaryBg: "bg-[#D4543C]",
    primaryBgHover: "hover:bg-[#B8433A]",
    primaryText: "text-[#D4543C] dark:text-[#F4A99A]",
    primaryBorder: "border-[#D4543C] dark:border-[#F4A99A]",
    primaryShadow: "shadow-[#D4543C]/15",

    successBg: "bg-[#2D6A4F]",
    successBgLight: "bg-[#E8F5EE]/80 dark:bg-[#2D6A4F]/20",
    successText: "text-[#2D6A4F] dark:text-[#E8F5EE]",
    successBorder: "border-[#E8F5EE] dark:border-[#2D6A4F]/40",

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

    pageBg: "bg-[#FAF8F5] dark:bg-[#141416]",
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
      "w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-[#D4543C]",
  },
};
