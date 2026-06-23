export function OrdersPreparingEmptyIllustration(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        viewBox="0 0 200 200"
        className="w-52 h-52 mx-auto text-zinc-300 dark:text-zinc-700 mb-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>No orders preparing</title>
        <rect x="70" y="110" width="60" height="50" rx="4" />
        <circle cx="85" cy="125" r="5" />
        <circle cx="115" cy="125" r="5" />
        <line x1="80" y1="145" x2="120" y2="145" />
        <rect x="80" y="95" width="40" height="15" rx="2" />
        <path d="M75 102h5M120 102h5" />
        <path d="M90 95c0-5 20-5 20 0" />
        <path d="M90 85c2-3-2-6 0-9M100 82c2-3-2-6 0-9M110 85c2-3-2-6 0-9" strokeWidth="1.5" />
        <path d="M128 45c-2-5-10-5-12 0-3-2-9-2-11 2-2-3-8-1-9 3 0 2 1 6 3 8h29c2-2 3-6 3-13z" />
        <rect x="101" y="58" width="27" height="8" rx="1" />
        <circle cx="114" cy="74" r="8" />
        <path d="M100 95v15c0 6 5 11 11 11h6c6 0 11-5 11-11V95" />
        <path d="M106 95h16v18c0 3-2 5-5 5h-6c-3 0-5-2-5-5V95z" strokeWidth="1.5" />
        <path d="M100 98c-8 3-12 8-15 12" />
      </svg>
      <p className="text-sm font-black text-zinc-500 dark:text-zinc-400">
        Orders being prepared in your kitchen
      </p>
      <p className="mt-0.5 text-xs font-bold text-zinc-400 dark:text-zinc-500">will appear here</p>
    </div>
  );
}
